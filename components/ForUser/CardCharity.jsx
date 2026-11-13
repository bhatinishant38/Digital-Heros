import {  Heart } from "lucide-react";

export const CardCharity = ({ charity, onDonate }) => {
  const imageUrl = charity.image;
  const raisedDisplay = `₹${Number(charity.raised || 0).toLocaleString('en-IN')}`;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm flex flex-col hover:shadow-md transition-all border-gray-100 group">
      {/* Cloudinary Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={charity.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x200?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 shadow-sm">
          {charity.category}
        </div>

        <div className="absolute bottom-3 left-3 bg-[#0B5D3B] text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
          {raisedDisplay} raised
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[14px] text-gray-900 leading-tight line-clamp-1">{charity.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{charity.category}</p>
        <p className="mt-2 text-[12px] text-gray-500 line-clamp-2 leading-relaxed min-h-8">{charity.description}</p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
          <span>{Number(charity.members || 0).toLocaleString()} members • {charity.raised ? `${Math.round((charity.raised/100000)*100)}% funded` : ''}</span>
        </div>

        {/* Donate button - redirects to donation page */}
        <button
          onClick={() => onDonate(charity)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B5D3B] py-2.5 text-[13px] font-semibold text-white hover:bg-[#094d31] transition"
        >
          <Heart size={16} className="fill-white" />
          Donate Now
        </button>
      </div>
    </div>
  );
};
