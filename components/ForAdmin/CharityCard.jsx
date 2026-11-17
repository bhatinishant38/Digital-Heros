import { Pencil, Trash2 } from "lucide-react";

// Tints defined locally in this file only - no external demo import
const tints = {
  Education: "from-emerald-600 to-teal-700",
  Healthcare: "from-[#0B5D3B] to-emerald-800",
  Environment: "from-green-600 to-emerald-700",
  "Food & Hunger": "from-lime-600 to-green-700",
  "Animal Welfare": "from-teal-600 to-emerald-700",
  "Disaster Relief": "from-emerald-700 to-[#0B5D3B]",
  All: "from-[#0B5D3B] to-emerald-700",
};

const CharityCard = ({ charity, onEdit, onDelete, isDeleting }) => {
  const tint = tints[charity.category] || tints.All;
  const imageUrl = typeof charity.image === "string" ? charity.image : charity.image?.url || "";

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm border-gray-100 group hover:shadow-md transition-shadow flex flex-col">
      {/* Image Header - Shows Cloudinary image clearly */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={charity.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"></div>
            <div className={`absolute inset-0 bg-linear-to-br ${tint} opacity-20`}></div>
            <div className="hidden absolute inset-0 bg-linear-to-br from-[#0B5D3B] to-emerald-700 flex items-center justify-center">
              <span className="text-white font-bold text-[28px]">{charity.name.charAt(0).toUpperCase()}</span>
            </div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${tint} flex items-center justify-center`}>
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
              <span className="text-white font-bold text-[22px]">{charity.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold text-gray-700 shadow-sm">
            {charity.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={() => onEdit(charity)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white shadow-sm transition"
          >
            <Pencil size={12} className="text-gray-700" />
          </button>
          <button
            onClick={() => onDelete(charity._id)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-red-50 hover:text-red-600 shadow-sm transition"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
            ₹{Number(charity.raised || 0).toLocaleString()} raised
          </div>
          <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-700">
            {Number(charity.members || 0).toLocaleString()} members
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[14px] text-gray-900 leading-tight line-clamp-1">{charity.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{charity.category}</p>
        <p className="mt-2 text-[12px] text-gray-500 line-clamp-2 leading-relaxed min-h-8">{charity.description}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(charity)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0B5D3B] py-2 text-[12px] font-semibold text-white hover:bg-[#094d31] transition"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(charity._id)}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;