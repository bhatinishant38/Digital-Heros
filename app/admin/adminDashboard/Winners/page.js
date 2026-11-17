import { Trophy } from "lucide-react";

const demoWinners = [
  { id: "winner-001", name: "Rohit Sharma", email: "rohit@example.com", draw: "October Charity Draw", prize: 25000, status: "Verified" },
  { id: "winner-002", name: "Neha Singh", email: "neha@example.com", draw: "October Charity Draw", prize: 12000, status: "Pending review" },
  { id: "winner-003", name: "Aman Verma", email: "aman@example.com", draw: "September Charity Draw", prize: 18000, status: "Paid" },
];

export default function WinnersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Winners</h1>
        <p className="mt-1 text-sm text-gray-500">Sample winner records and verification status.</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-[#0B5D3B]">
            <Trophy size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Prize Winners</h2>
            <p className="text-xs text-gray-500">Temporary demo data</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Winner</th>
                <th className="px-5 py-3 font-medium">Draw</th>
                <th className="px-5 py-3 font-medium">Prize</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoWinners.map((winner) => (
                <tr key={winner.id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{winner.name}</p>
                    <p className="text-xs text-gray-500">{winner.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{winner.draw}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">₹{winner.prize.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${winner.status === "Paid" ? "bg-emerald-100 text-[#0B5D3B]" : "bg-amber-50 text-amber-700"}`}>
                      {winner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}