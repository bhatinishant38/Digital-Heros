import Link from "next/link";


const CharityBanner = ({ name, image }) => (
  <section className="flex items-center gap-5 overflow-hidden rounded-xl border border-gray-100 bg-emerald-50/60 shadow-sm">
    {image ? (
      <img src={image} alt={name} className="h-28 w-48 shrink-0 object-cover" />
    ) : (
      <div className="h-28 w-48 shrink-0 bg-emerald-100" />
    )}

    <div className="flex-1 py-4">
      <p className="text-sm text-gray-500">
        {name ? "You're supporting" : "Support a cause"}
      </p>
      <h3 className="text-xl font-bold text-gray-900">
        {name || "No charity selected"}
      </h3>
      <p className="text-sm text-gray-500">
        {name
          ? "Thank you for supporting this cause."
          : "Choose a charity to make a difference."}
      </p>
    </div>

    <Link
      href="/dashboard/charity"
      className="mr-5 rounded-lg border border-[#0B5D3B] bg-white px-4 py-2 text-sm font-semibold text-[#0B5D3B] transition-colors hover:bg-emerald-50"
    >
      Support more Causes
    </Link>
  </section>
);

export default CharityBanner;
