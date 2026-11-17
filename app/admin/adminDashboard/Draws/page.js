import { CalendarDays, Ticket } from "lucide-react";

const demoDraws = [
  { id: "draw-001", title: "November Charity Draw", date: "2026-11-30", prizePool: 125000, entries: 842, status: "Open" },
  { id: "draw-002", title: "October Charity Draw", date: "2026-10-31", prizePool: 98000, entries: 716, status: "Completed" },
  { id: "draw-003", title: "December Charity Draw", date: "2026-12-31", prizePool: 150000, entries: 0, status: "Scheduled" },
];

export default function DrawsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Draws</h1>
        <p className="mt-1 text-sm text-gray-500">Sample draw schedule and entry totals.</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-[#0B5D3B]">
            <Ticket size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Draw Schedule</h2>
            <p className="text-xs text-gray-500">Temporary demo data</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Draw</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Prize Pool</th>
                <th className="px-5 py-3 font-medium">Entries</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoDraws.map((draw) => (
                <tr key={draw.id} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-medium text-gray-900">{draw.title}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} />{new Date(`${draw.date}T00:00:00`).toLocaleDateString("en-GB")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">₹{draw.prizePool.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-gray-600">{draw.entries.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-[#0B5D3B]">{draw.status}</span>
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
