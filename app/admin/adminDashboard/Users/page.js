"use client";

import { useContext, useState } from "react";
import { Search, Users as UsersIcon, CheckCircle, Clock } from "lucide-react";
import { AdminContext } from "@/context/AdminContext";
import { formatDate } from "@/components/ForUser/formatDate";

const USERS_PER_PAGE = 10;

// ---- Helpers ----

const hasActiveSubscription = (user) =>
  Boolean(
    user.isSubscribed &&
      user.subscriptionEnd &&
      new Date(user.subscriptionEnd) > new Date(),
  );

const isExpired = (user) =>
  Boolean(user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date());

const inputClass =
  "rounded-lg border  text-gray-500 border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100";

// A small number card at the top
const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#0B5D3B]">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// ---- Page ----

const Users = () => {
  const { users, loading, usersError, charityNames = {} } = useContext(AdminContext);

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Numbers for the top cards
  const totalUsers = users.length;
  const expiredCount = users.filter(isExpired).length;
  const activeCount = users.filter(hasActiveSubscription).length;

  // Apply search and plan filter
  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase().trim();
    const matchesSearch =
      (user.name || "").toLowerCase().includes(text) ||
      (user.email || "").toLowerCase().includes(text);
    const matchesPlan =
      planFilter === "all" || user.subscriptionPlan === planFilter;
    return matchesSearch && matchesPlan;
  });

  // Show only one page at a time
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  const startIndex = (page - 1) * USERS_PER_PAGE;
  const pageUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Everyone who has registered on the platform.
        </p>
      </div>

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={UsersIcon} label="Total Users" value={totalUsers} />
        <SummaryCard
          icon={CheckCircle}
          label="Active Subscriptions"
          value={activeCount}
        />
        <SummaryCard
          icon={Clock}
          label="Expired Subscriptions"
          value={expiredCount}
        />
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className={`${inputClass} w-full pl-9`}
          />
        </div>

        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setPage(1);
          }}
          className={`${inputClass} sm:w-44 `}
        >
          <option className="text-gray-600" value="all">All plans</option>
          <option className="text-gray-600" value="monthly">Monthly</option>
          <option className="text-gray-600" value="yearly">Yearly</option>
        </select>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-emerald-50/60 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Plan ends</th>
                <th className="px-5 py-3 font-medium">Charity</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : usersError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-red-600"
                    role="alert"
                  >
                    {usersError}
                  </td>
                </tr>
              ) : pageUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                pageUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-100">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B5D3B] text-sm font-semibold text-white">
                            {user.name[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-gray-600">
                      {user.phone || "-"}
                    </td>

                    <td className="px-5 py-3.5">
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

                    <td className="px-5 py-3.5 text-gray-600">
                      {user.subscriptionEnd
                        ? formatDate(user.subscriptionEnd)
                        : "-"}
                      {isExpired(user) && (
                        <span className="ml-2 text-xs font-medium text-red-600">
                          Expired
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-gray-600">
                      {charityNames[user.charity] || user.charity}
                    </td>

                    <td className="px-5 py-3.5 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
            <p>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
