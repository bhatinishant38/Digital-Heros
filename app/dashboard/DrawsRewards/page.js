import { Crown, Trophy, ChevronDown } from "lucide-react";
import Link from "next/link";


// ---- Data (later you can fetch this from your backend) ----

const nextDraw = {
  date: "01 Jan 2027",
  prizePool: "$1,25,000",
};

const prizeDistribution = [
  { match: "5 Match", percent: "40%", crownColor: "text-yellow-500" },
  { match: "4 Match", percent: "35%", crownColor: "text-slate-400" },
  { match: "3 Match", percent: "25%", crownColor: "text-orange-500" },
];

const previousWinners = [
  { month: "Aug 2026", winner: "Rohit Sharma", prize: "$25,000" },
  { month: "Jul 2026", winner: "Aman Verma", prize: "$18,000" },
  { month: "Jun 2026", winner: "Neha Singh", prize: "$12,000" },
];

// ---- Page ----

const Draws = ({ userName = "Nishant" }) => {
  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-8">
        {/* User name, top right */}
        <div className="flex items-center justify-between gap-4 text-sm text-gray-700">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Digital Heroes
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Draws & Rewards
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B5D3B] text-xs font-semibold text-white">
              {userName[0]}
            </div>
            <span>{userName}</span>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Monthly Draw */}
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Monthly Draw
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Your next chance to win and make an impact.
            </p>
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Draw</p>
              <p className="mb-4 text-2xl font-bold text-gray-900">
                {nextDraw.date}
              </p>
              <Link
                href="#"
                className="inline-block rounded-lg bg-[#0B5D3B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#094d31]"
              >
                See Details
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-3xl font-bold text-gray-900">
                  {nextDraw.prizePool}
                </p>
              </div>
              <Trophy size={48} className="text-[#0B5D3B]" />
            </div>
          </div>
        </section>

        {/* Prize Distribution */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-[#0B5D3B]">
            Prize Distribution
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {prizeDistribution.map((item) => (
              <div
                key={item.match}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-white py-5 shadow-sm"
              >
                <Crown size={24} className={item.crownColor} />
                <p className="mt-2 text-sm text-gray-600">{item.match}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.percent}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Winners */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B5D3B]">
              Previous Winners
            </h2>
            <Link
              href="/dashboard/winnings"
              className="text-sm font-medium text-[#0B5D3B] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Month</th>
                  <th className="px-5 py-3 font-medium">Winner</th>
                  <th className="px-5 py-3 font-medium">Prize</th>
                </tr>
              </thead>
              <tbody>
                {previousWinners.map((row) => (
                  <tr key={row.month} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-700">{row.month}</td>
                    <td className="px-5 py-3 text-gray-900">{row.winner}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {row.prize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Draws;
