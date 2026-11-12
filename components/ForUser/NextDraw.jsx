import { Trophy } from "lucide-react";
import Link from "next/link";


const NextDraw = ({ date, prize }) => (
  <section className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="font-semibold text-gray-900">Next Draw</h2>
        <p className="mt-3 text-sm text-gray-500">Prize Pool</p>
        <p className="text-sm font-semibold text-gray-800">{date}</p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#0B5D3B]">
        <Trophy size={28} />
      </div>
    </div>

    <p className="mt-2 text-3xl font-bold text-gray-900">{prize}</p>

    <Link
      to="/userhome/draws"
      className="mt-auto rounded-lg bg-[#0B5D3B] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#094d31]"
    >
      View Rewards
    </Link>
  </section>
);

export default NextDraw;
