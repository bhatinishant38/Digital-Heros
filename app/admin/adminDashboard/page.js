import Link from "next/link";
import {
  CreditCard,
  Heart,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

const sections = [
  {
    href: "/admin/adminDashboard/Users",
    label: "Users",
    description: "Review registered users and account details.",
    icon: Users,
  },
  {
    href: "/admin/adminDashboard/Subscriptions",
    label: "Subscriptions",
    description: "Review subscription plans and expiry dates.",
    icon: CreditCard,
  },
  {
    href: "/admin/adminDashboard/Charities",
    label: "Charities",
    description: "Manage the charities supported by the platform.",
    icon: Heart,
  },
  {
    href: "/admin/adminDashboard/Draws",
    label: "Draws",
    description: "Manage upcoming draws and entries.",
    icon: Ticket,
  },
  {
    href: "/admin/adminDashboard/Winners",
    label: "Winners",
    description: "Review and manage draw winners.",
    icon: Trophy,
  },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto w-full max-w-6xl">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold text-green-950">
          Admin dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage users, subscriptions, charities, draws, and winners.
        </p>
      </header>

      <section
        aria-label="Admin sections"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {sections.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          >
            <Icon className="h-5 w-5 text-green-700" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-green-950">{label}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
