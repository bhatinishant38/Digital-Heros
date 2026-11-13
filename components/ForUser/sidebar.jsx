"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Target,
  Gift,
  Heart,
  Trophy,
  User,
  LogOut,
 
} from "lucide-react";
import { MdSubscriptions } from "react-icons/md";




const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/MyScores", label: "My Scores", icon: Target },
  { to: "/dashboard/DrawsRewards", label: "Draws & Rewards", icon: Gift },
  { to: "/dashboard/charity", label: "Charity", icon: Heart },
];

const accountLinks = [
  { to: "/dashboard/winnings", label: "Winnings", icon: Trophy },
  { to: "/dashboard/subscription", label: "Subscription", icon:  MdSubscriptions },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

const NavItem = ({ to, label, icon: Icon, pathname }) => {
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link
      href={to}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      title={label}
      className={`group flex items-center justify-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors md:justify-start md:px-3 ${
        isActive
          ? "bg-white/15 font-semibold text-white shadow-sm"
          : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon
        size={18}
        aria-hidden="true"
        className={`shrink-0 transition-colors ${
          isActive ? "text-emerald-200" : "group-hover:text-emerald-200"
        }`}
      />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-16 shrink-0 flex-col overflow-y-auto bg-[#0B5D3B] px-2 py-5 text-white shadow-lg md:w-60 md:px-4 md:py-6">
      <Link
        href="/dashboard"
        aria-label="Digital Heroes dashboard"
        className="mb-8 flex items-center justify-center gap-3 md:justify-start md:px-2"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-emerald-100">
          <Heart size={19} aria-hidden="true" />
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-base font-bold tracking-tight">
            Digital Heroes
          </span>
          <span className="block text-xs text-emerald-100/70">
            Golf for good
          </span>
        </span>
      </Link>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/55 md:block">
          Menu
        </p>
        {mainLinks.map((link) => (
          <NavItem key={link.to} {...link} pathname={pathname} />
        ))}
      </nav>

      <nav
        aria-label="Account navigation"
        className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-5"
      >
        <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/55 md:block">
          Account
        </p>
        {accountLinks.map((link) => (
          <NavItem key={link.to} {...link} pathname={pathname} />
        ))}
      </nav>

      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/" })}
        aria-label="Log out"
        title="Log out"
        className="mt-auto flex w-full items-center justify-center gap-3 rounded-xl px-2 py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:justify-start md:px-3"
      >
        <LogOut size={18} aria-hidden="true" className="shrink-0" />
        <span className="hidden md:inline">Log out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
