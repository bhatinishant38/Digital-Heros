"use client";

import Link from "next/link";
import { useContext } from "react";
import { CreditCard, Heart, Ticket, Trophy, Users, Wallet } from "lucide-react";
import { formatDate } from "@/components/ForUser/formatDate";
import { AdminContext } from "@/context/AdminContext";

const mockData = {
  totalDraws: 9,
  totalWinners: 27,
  pendingVerifications: 4,
  prizePaid: 452000,
  charityRaised: 385600,
  nextDraw: { date: "01 Oct 2026", prizePool: 125000 },
  pendingWinners: [
    { id: 1, name: "Rohit Sharma", prize: 25000, draw: "Sep 2026" },
    { id: 2, name: "Neha Singh", prize: 12000, draw: "Sep 2026" },
    { id: 3, name: "Aman Verma", prize: 18000, draw: "Aug 2026" },
  ],
};

const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

const hasActiveSubscription = (user) =>
  Boolean(
    user.isSubscribed &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date(),
  );

// One number card at the top of the page
const StatCard = ({ icon: Icon, label, value, note }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#0B5D3B]">
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="truncate text-xs text-gray-400">{note}</p>
    </div>
  </div>
);

// ---- Page ----

const AdminDashboard = () => {
  const { users, loading, usersError } = useContext(AdminContext);
  const data = mockData;
  const { totalDraws, totalWinners, pendingVerifications, prizePaid, charityRaised, nextDraw, pendingWinners } = data;

  const totalUsers = users.length;
  const activeUsers = users.filter(hasActiveSubscription);
  const activeSubscriptions = activeUsers.length;
  const monthlyCount = activeUsers.filter((user) => user.subscriptionPlan === "monthly").length;
  const yearlyCount = activeUsers.filter((user) => user.subscriptionPlan === "yearly").length;
  const totalPlans = monthlyCount + yearlyCount;
  const monthlyPercent = totalPlans === 0 ? 0 : Math.round((monthlyCount / totalPlans) * 100);
  const yearlyPercent = totalPlans === 0 ? 0 : 100 - monthlyPercent;

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const newUsersThisMonth = users.filter((u) => {
    const created = new Date(u.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">A quick look at how the platform is doing.</p>
      </div>

      {/* Numbers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={loading ? "…" : totalUsers.toLocaleString("en-IN")}
          note={loading ? "" : `+${newUsersThisMonth} this month`}
        />
        <StatCard
          icon={CreditCard}
          label="Active Subscriptions"
          value={loading ? "…" : activeSubscriptions.toLocaleString("en-IN")}
          note={
            loading || totalUsers === 0
              ? ""
              : `${Math.round((activeSubscriptions / totalUsers) * 100)}% of all users`
          }
        />
        <StatCard
          icon={Ticket}
          label="Total Draws"
          value={totalDraws}
          note={`Next draw: ${nextDraw.date}`}
        />
        <StatCard
          icon={Trophy}
          label="Total Winners"
          value={totalWinners}
          note={`${pendingVerifications} waiting for review`}
        />
        <StatCard
          icon={Wallet}
          label="Prize Money Paid"
          value={money(prizePaid)}
          note="All draws so far"
        />
        <StatCard
          icon={Heart}
          label="Raised for Charities"
          value={money(charityRaised)}
          note="From subscriptions"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent users */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Users</h2>
            <Link href="/admin/adminDashboard/Users" className="text-sm font-medium text-[#0B5D3B] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : usersError ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-red-600" role="alert">
                      {usersError}
                    </td>
                  </tr>
                ) : recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 font-medium text-gray-900">{user.name}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            user.isSubscribed
                              ? "bg-emerald-100 text-[#0B5D3B]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.subscriptionPlan || "None"}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-600">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Winners waiting for review */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Needs Review</h2>
            <Link href="/admin/adminDashboard/Winners" className="text-sm font-medium text-[#0B5D3B] hover:underline">
              View All
            </Link>
          </div>

          {pendingWinners.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">Nothing waiting. All caught up!</p>
          ) : (
            <ul className="space-y-3">
              {pendingWinners.map((winner) => (
                <li
                  key={winner.id}
                  className="flex items-center justify-between rounded-lg bg-emerald-50/60 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{winner.name}</p>
                    <p className="text-xs text-gray-500">{winner.draw} draw</p>
                  </div>
                  <p className="text-sm font-semibold text-[#0B5D3B]">{money(winner.prize)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Plan split */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Subscriptions by Plan</h2>

          <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="bg-[#0B5D3B]" style={{ width: `${monthlyPercent}%` }} />
            <div className="bg-emerald-300" style={{ width: `${yearlyPercent}%` }} />
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#0B5D3B]" />
              <span className="text-gray-600">
                Monthly: <span className="font-semibold text-gray-900">{monthlyCount}</span> ({monthlyPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
              <span className="text-gray-600">
                Yearly: <span className="font-semibold text-gray-900">{yearlyCount}</span> ({yearlyPercent}%)
              </span>
            </div>
          </div>
        </section>

        {/* Next draw */}
        <section className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <h2 className="font-semibold text-gray-900">Next Draw</h2>
          <p className="mt-3 text-sm text-gray-600">{nextDraw.date}</p>
          <p className="text-3xl font-bold text-gray-900">{money(nextDraw.prizePool)}</p>
          <p className="mb-4 text-xs text-gray-500">Prize pool</p>
          <Link
            href="/admin/adminDashboard/Draws"
            className="inline-block rounded-lg bg-[#0B5D3B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#094d31]"
          >
            Manage Draws
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;