'use client'
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trophy, Upload, Check } from "lucide-react";

// ---- Data (later you can fetch this from your backend) ----

const win = {
  amount: "$25,000",
  matches: "4-number match",
  draw: "September Draw",
};

// The 4 steps of verification, in order
const steps = [
  { label: "Upload Proof" },
  { label: "Admin Review" },
  { label: "Approved" },
  { label: "Payout" },
];

// Small confetti pieces (position in %, color, size, rotation)
const confetti = [
  { top: "12%", left: "6%", color: "bg-emerald-400", size: "h-3 w-1.5", rotate: "rotate-45" },
  { top: "30%", left: "14%", color: "bg-emerald-600", size: "h-2 w-2", rotate: "rotate-12" },
  { top: "60%", left: "8%", color: "bg-emerald-300", size: "h-3 w-1.5", rotate: "-rotate-45" },
  { top: "18%", left: "26%", color: "bg-emerald-500", size: "h-2 w-2", rotate: "rotate-45" },
  { top: "72%", left: "22%", color: "bg-emerald-400", size: "h-1.5 w-3", rotate: "rotate-12" },
  { top: "10%", left: "42%", color: "bg-emerald-300", size: "h-3 w-1.5", rotate: "-rotate-12" },
  { top: "80%", left: "45%", color: "bg-emerald-500", size: "h-2 w-2", rotate: "rotate-45" },
  { top: "14%", left: "62%", color: "bg-emerald-600", size: "h-1.5 w-3", rotate: "rotate-45" },
  { top: "70%", left: "66%", color: "bg-emerald-300", size: "h-3 w-1.5", rotate: "-rotate-45" },
  { top: "25%", left: "78%", color: "bg-emerald-400", size: "h-2 w-2", rotate: "rotate-12" },
  { top: "55%", left: "86%", color: "bg-emerald-500", size: "h-3 w-1.5", rotate: "rotate-45" },
  { top: "12%", left: "92%", color: "bg-emerald-300", size: "h-1.5 w-3", rotate: "-rotate-12" },
  { top: "82%", left: "93%", color: "bg-emerald-600", size: "h-2 w-2", rotate: "rotate-45" },
];

// ---- Page ----

const Winnings = ({ token, backendUrl }) => {
  // 0 = Upload Proof, 1 = Admin Review, 2 = Approved, 3 = Payout
  // (later, load the real step from your backend)
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChosen = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic checks before we upload
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG or PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. The limit is 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);

    setUploading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/user/winnings/proof", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Proof uploaded. An admin will review it soon.");
        setCurrentStep(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
      event.target.value = ""; // lets the user pick the same file again if needed
    }
  };

  // Text under each step label
  const getStepHint = (index) => {
    if (index < currentStep) return "Done";
    if (index === currentStep) return index === 0 ? "Your action" : "Pending";
    if (index === currentStep + 1) return "Next";
    return "Upcoming";
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-xl font-bold text-[#0B5D3B]">Winner Verification</h1>

      {/* Congratulations card */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 px-6 py-10 text-center">
        {confetti.map((piece, i) => (
          <span
            key={i}
            className={`absolute rounded-sm ${piece.color} ${piece.size} ${piece.rotate}`}
            style={{ top: piece.top, left: piece.left }}
          />
        ))}

        <div className="relative">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D3B] text-white">
            <Trophy size={24} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
          <p className="mt-2 text-lg font-semibold text-gray-800">You've won {win.amount}</p>
          <p className="text-sm text-gray-500">
            {win.matches} · {win.draw}
          </p>

          {/* Hidden file input, opened by the button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChosen}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={currentStep !== 0 || uploading}
            className="mx-auto mt-6 flex items-center gap-2 rounded-lg bg-[#0B5D3B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#094d31] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : currentStep === 0 ? "Upload Score Proof" : "Proof submitted"}
          </button>
        </div>
      </div>

      {/* Progress steps */}
      <div className="mt-8 flex items-start">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.label} className="relative flex flex-1 flex-col items-center text-center">
              {/* Line connecting this step to the next one */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${
                    isDone ? "bg-[#0B5D3B]" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  isDone
                    ? "border-[#0B5D3B] bg-[#0B5D3B] text-white"
                    : isCurrent
                    ? "border-[#0B5D3B] bg-[#0B5D3B] text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {isDone ? <Check size={16} /> : index + 1}
              </div>

              <p className={`mt-2 text-sm font-medium ${isDone || isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-400">{getStepHint(index)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Winnings;
