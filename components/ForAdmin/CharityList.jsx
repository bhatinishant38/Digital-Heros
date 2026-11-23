import { useContext, useMemo, useState } from "react";
import { Search } from "lucide-react";
import CharityCard from "./CharityCard";

import { AdminContext } from "@/context/AdminContext";


const VISIBLE_COUNT = 6;

// Component 2: Charity List - handles search, filter, grid, show more
const CharityList = ({  onEdit, onDelete, deletingId }) => {

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const { charities, categories } = useContext(AdminContext);

  const filtered = useMemo(() => {
    return charities.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const matchesQuery =
        !query.trim() ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [charities, query, category]);

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  return (
    <div>
      {/* Search */}
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
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100 placeholder:text-gray-400"
        />
      </div>

      {/* Category buttons - same as your example */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setShowAll(false);
            }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors border ${
              category === cat
                ? "bg-[#0B5D3B] text-white border-[#0B5D3B]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((charity) => (
            <CharityCard
              key={charity._id}
              charity={charity}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={deletingId === charity._id}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white border border-gray-100 grid place-items-center mb-3">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-[13px] text-gray-500">No charities match your search.</p>
          <p className="text-[12px] text-gray-400 mt-1">Try a different name or category.</p>
        </div>
      )}

      {/* Show more */}
      {!showAll && filtered.length > VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full border border-[#0B5D3B]/30 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#0B5D3B] hover:bg-emerald-50 transition"
          >
            Show more charities ({filtered.length - VISIBLE_COUNT} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default CharityList;
