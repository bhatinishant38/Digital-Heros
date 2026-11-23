"use client";

import { useContext } from "react";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { AdminContext } from "@/context/AdminContext";

const isActive = (user) =>
  Boolean(
    user.isSubscribed &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date(),
  );

export default function SubscriptionsPage() {
  const { users } = useContext(AdminContext);
  const subscribedUsers = users.filter((user) => user.subscriptionPlan);
  const activeCount = subscribedUsers.filter(isActive).length;
  const expiredCount = subscribedUsers.filter((user) => !isActive(user)).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Demo subscription records for registered users.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CreditCard}
          label="Total Subscriptions"
          value={subscribedUsers.length}
        />
        <SummaryCard icon={CheckCircle} label="Active" value={activeCount} />
        <SummaryCard icon={Clock} label="Expired" value={expiredCount} />
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Subscription Ends</th>
              </tr>
            </thead>
            <tbody>
              {subscribedUsers.map((user) => {
                const active = isActive(user);
                return (
                  <tr key={user._id} className="border-t border-gray-100">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-700">
                      {user.subscriptionPlan}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          active
                            ? "bg-emerald-100 text-[#0B5D3B]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {active ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {user.subscriptionEnd
                        ? formatDate(user.subscriptionEnd)
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-[#0B5D3B]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
