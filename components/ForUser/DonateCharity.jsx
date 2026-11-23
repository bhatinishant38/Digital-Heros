import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Heart, ShieldCheck, Users, IndianRupee } from "lucide-react";

export default function DonateCharity() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, charities } = useContext(AppContext);

  const [charity, setCharity] = useState(location.state?.charity || null);
  const [loading, setLoading] = useState(!location.state?.charity);
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [donating, setDonating] = useState(false);

  const presetAmounts = [100, 500, 1000, 2500, 5000];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCharity = async () => {
      if (charity) return;
      const fromContext = charities.find((c) => c._id === id);
      if (fromContext) {
        setCharity(fromContext);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/charities/${id}`);
        setCharity(data.charity || data);
      } catch (err) {
        toast.error("Charity not found");
        navigate("/userhome/charity");
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  const getFinalAmount = () => (customAmount ? Number(customAmount) : amount);

  const handleRazorpayDonate = async () => {
    const finalAmount = getFinalAmount();

    if (!finalAmount || finalAmount < 10) {
      toast.error("Enter valid amount (min ₹10)");
      return;
    }

    if (!token) {
      toast.error("Please log in to donate");
      return;
    }

    setDonating(true);
    try {
      // 1. Create Razorpay order from backend
      // Route: POST /api/donation/create-order (authUser)
      const { data: orderData } = await axios.post(
        `${backendUrl}/api/user/create-order`,
        {
          charityId: id,
          amount: finalAmount, // in INR
        },
        { headers: { token } }
      );

      if (!orderData.success) {
        toast.error(orderData.message);
        setDonating(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount, // in paise
        currency: orderData.order.currency,
        name: "Digital Heroes Charity",
        description: `Donation to ${charity.name}`,
        image: charity.image,
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          // Route: POST /api/donation/verify-payment (authUser)
          try {
            const { data: verifyData } = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                charityId: id,
                amount: finalAmount,
              },
              { headers: { token } }
            );

            if (verifyData.success) {
              toast.success(`Thank you! ₹${finalAmount} donated to ${charity.name} ❤️`);
              navigate("/userhome/charity", { state: { donated: true } });
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
            console.error(err);
          } finally {
            setDonating(false);
          }
        },
        notes: {
          charityId: id,
          charityName: charity.name,
        },
        theme: {
          color: "#0B5D3B",
        },
        modal: {
          ondismiss: () => setDonating(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setDonating(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create donation order");
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded-2xl mb-6"></div>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!charity) return null;

  const progress = Math.min(100, Math.round((charity.raised / 100000) * 100));

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={16} /> Back to charities
        </button>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left - Charity Details (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-75 overflow-hidden relative">
                <img src={charity.image} alt={charity.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold text-gray-800">
                    {charity.category}
                  </span>
                  <h1 className="mt-2 text-2xl font-bold text-white">{charity.name}</h1>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900">About this cause</h3>
                <p className="mt-2 text-[14px] text-gray-600 leading-relaxed">{charity.description}</p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="bg-[#f6f8f6] rounded-xl p-3 text-center">
                    <p className="text-[18px] font-bold text-[#0B5D3B]">₹{Number(charity.raised).toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-gray-500">Raised</p>
                  </div>
                  <div className="bg-[#f6f8f6] rounded-xl p-3 text-center">
                    <p className="text-[18px] font-bold text-gray-900">{charity.members}</p>
                    <p className="text-[11px] text-gray-500">Members</p>
                  </div>
                  <div className="bg-[#f6f8f6] rounded-xl p-3 text-center">
                    <p className="text-[18px] font-bold text-gray-900">{progress}%</p>
                    <p className="text-[11px] text-gray-500">Funded</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#0B5D3B] h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">₹{charity.raised.toLocaleString()} raised of ₹1,00,000 goal</p>
                </div>

                <div className="mt-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2">
                  <ShieldCheck size={18} className="text-[#0B5D3B] shrink-0 mt-0.5" />
                  <div className="text-[12px]">
                    <p className="font-semibold text-[#0B5D3B]">100% Secure & Transparent</p>
                    <p className="text-gray-600 mt-0.5">80G tax exempt • Instant receipt • Direct to charity • Razorpay secured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Donation Form with Razorpay (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              <h2 className="font-bold text-[16px] text-gray-900 flex items-center gap-2">
                <Heart size={18} className="text-[#0B5D3B] fill-[#0B5D3B]" /> Donate to {charity.name}
              </h2>

              <div className="mt-5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Select Amount</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2.5 rounded-xl border text-[13px] font-semibold transition ${
                        amount === amt && !customAmount
                          ? "bg-[#0B5D3B] text-white border-[#0B5D3B]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-50"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Custom Amount (₹)</label>
                <div className="relative mt-1.5">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="10"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-[14px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mt-5 p-3 bg-[#f6f8f6] rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Donation</span>
                  <span className="font-bold">₹{getFinalAmount().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>To: {charity.name}</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {charity.members} supporters
                  </span>
                </div>
              </div>

              <button
                onClick={handleRazorpayDonate}
                disabled={donating}
                className="mt-5 w-full bg-[#0B5D3B] text-white py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#094d31] disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-sm"
              >
                {donating ? (
                  "Opening Razorpay..."
                ) : (
                  <>
                    <Heart size={18} className="fill-white" /> Donate ₹{getFinalAmount().toLocaleString("en-IN")} with Razorpay
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-3">
                Powered by Razorpay • UPI, Cards, NetBanking, Wallets • 100% Secure
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4 opacity-60" />
                <span className="text-[10px] text-gray-400">Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
