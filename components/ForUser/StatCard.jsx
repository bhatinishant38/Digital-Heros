const StatCard = ({ icon: Icon, label, value, note }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-[#0B5D3B]">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  </div>
);

export default StatCard;
