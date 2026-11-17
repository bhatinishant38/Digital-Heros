"use client";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  Heart,
  Trophy,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  {
    href: "/admin/adminDashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { href: "/admin/adminDashboard/Users", label: "Users", icon: Users },
  {
    href: "/admin/adminDashboard/Charities",
    label: "Charities",
    icon: Heart,
  },
  {
    href: "/admin/adminDashboard/Subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  { href: "/admin/adminDashboard/Draws", label: "Draws", icon: Ticket },
  { href: "/admin/adminDashboard/Winners", label: "Winners", icon: Trophy },
];

function NavItem({ href, label, icon: Icon, end, pathname }) {
  const isActive = end
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      title={label}
      className={`flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors md:justify-start md:px-3 ${
        isActive
          ? "bg-white/15 font-semibold text-white ring-1 ring-white/25"
          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} aria-hidden="true" className="shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-16 shrink-0 flex-col overflow-y-auto bg-linear-to-b from-[#0B5D3B] to-[#083F29] px-2 py-5 text-white shadow-lg md:w-60 md:px-4 md:py-6">
      <Link
        href="/admin/adminDashboard"
        className="mb-8 flex items-center justify-center gap-2.5 md:justify-start md:px-2"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck size={18} aria-hidden="true" />
        </span>
        <span className="hidden text-lg font-bold tracking-tight md:inline">
          Admin Panel
        </span>
      </Link>

      <nav aria-label="Admin navigation" className="flex flex-col gap-1">
        {links.map((link) => (
          <NavItem key={link.href} {...link} pathname={pathname} />
        ))}
      </nav>

      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/admin/login" })}
        aria-label="Log out"
        title="Log out"
        className="mt-auto flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:justify-start md:px-3"
      >
        <LogOut size={18} aria-hidden="true" className="shrink-0" />
        <span className="hidden md:inline">Log out</span>
      </button>
    </aside>
  );
}
