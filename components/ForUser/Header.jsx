'use client'
import { ChevronDown } from "lucide-react";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Header = ({ user }) => (
  <header className="flex items-start justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getGreeting()}, {user.name} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Here&apos;s what&apos;s happening with your account.
      </p>
    </div>

    <div className="flex items-center gap-2">
      {user.image ? (
        <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B5D3B] text-sm font-semibold text-white">
          {user.name?.[0]?.toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-gray-800">{user.name}</span>
      <ChevronDown size={16} className="text-gray-500" />
    </div>
  </header>
);

export default Header;
