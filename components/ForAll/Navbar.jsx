'use client'

import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";

const navItems = ["Home", "How-It-Works", "Charities", "Subscriptions"];

function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8">
      <defs>
        <linearGradient id="dh-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <path
        fill="url(#dh-logo)"
        d="M16 2.5 28 6.4v9.2c0 6.6-4.6 12.3-12 14.4C8.6 27.9 4 22.2 4 15.6V6.4L16 2.5Z"
      />
      <path
        fill="#fff"
        d="M11 11h4.5v3.2H11V11Zm5.6 0H21v3.2h-4.4V11Zm-5.6 4.4h4.5v3.2H11v-3.2Zm5.6 0H21v7.2h-4.4v-7.2Z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep the mobile menu from staying open when the user rotates or resizes.
  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  function selectItem(item) {
    setActive(item);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <a
            href="/"
            onClick={() => selectItem("Home")}
            className="flex shrink-0 items-center gap-2.5"
          >
            <Logo />
            <span className="text-base font-semibold text-slate-900 sm:text-lg">
              Digital Heroes
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setActive(item)}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:text-base ${
                  active === item
                    ? "text-green-800"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item}
                <span
                  className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-green-700 transition-opacity ${
                    active === item ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Visible on every screen size */}
            <a
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50 sm:px-4"
            >
              Log in
            </a>

            <a
              href="/api/auth/signup"
              className="hidden rounded-full bg-linear-to-r from-green-600 to-green-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-900/20 hover:shadow-md md:block"
            >
              Sign Up
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-green-600 hover:text-green-700 md:hidden"
            >
              {menuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* grid-rows trick so the panel animates to whatever height it needs */}
        <div
          id="mobile-menu"
          className={`grid overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="mt-3 flex flex-col gap-1 border-t border-slate-200 pt-3">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => selectItem(item)}
                  tabIndex={menuOpen ? 0 : -1}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    active === item
                      ? "bg-green-50 text-green-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item}
                </a>
              ))}

              <a
                href="/api/auth/signup"
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className="mt-3 mb-1 rounded-full bg-linear-to-r from-green-600 to-green-800 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
