'use client'
import { useState, useContext, useEffect } from "react";
import { Search, Heart } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { CardCharity } from "@/components/ForUser/CardCharity";


const VISIBLE_COUNT = 6;

// ---- Charity Card - Donate button with Cloudinary image ----

// ---- Main Page ----
const Charity = () => {
  const { charities, categories, getCharities} = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  

  useEffect(() => {
     getCharities();
  }, [getCharities]);

  const filtered = charities.filter((charity) => {
    const matchesCategory = category === "All" || charity.category === category;
    const matchesQuery = charity.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  // Donate logic - redirect to donation page with charity data
  const handleDonate = (charity) => {
    
   console.log('navigating')
    
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-bold text-[#0B5D3B]">Support a Cause</h1>
      <p className="mb-5 text-sm text-gray-500">
        Choose a charity and make a difference. Your donation directly funds these causes. ({charities.length} charities)
      </p>

      <div className="relative max-w-120 text-gray-700">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowAll(false);
          }}
          placeholder="Search charities..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setShowAll(false);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
              category === cat
                ? "bg-[#0B5D3B] text-white border-[#0B5D3B]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((charity) => (
            <CardCharity key={charity._id} charity={charity} onDonate={handleDonate} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-gray-400">
          No charities match your search.
        </p>
      )}

      {!showAll && filtered.length > VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full border border-[#0B5D3B]/30 bg-white px-6 py-2.5 text-sm font-semibold text-[#0B5D3B] hover:bg-emerald-50"
          >
            Show more charities ({filtered.length - VISIBLE_COUNT} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default Charity;