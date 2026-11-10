'use client'

import { useContext, useState } from "react";
import { Eye, EyeOff, Leaf } from "lucide-react";

import axios from "axios";

import Navbar from "../../components/ForAll/Navbar";

function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
      <defs>
        <linearGradient id="dh-logo-3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <path
        fill="url(#dh-logo-3)"
        d="M16 2.5 28 6.4v9.2c0 6.6-4.6 12.3-12 14.4C8.6 27.9 4 22.2 4 15.6V6.4L16 2.5Z"
      />
      <path
        fill="#fff"
        d="M11 11h4.5v3.2H11V11Zm5.6 0H21v3.2h-4.4V11Zm-5.6 4.4h4.5v3.2H11v-3.2Zm5.6 0H21v7.2h-4.4v-7.2Z"
      />
    </svg>
  );
}

/* Painted course scene, reused from the hero so the two pages feel related */
function CourseScene() {
  return (
    <svg
      viewBox="0 0 400 640"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="login-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeee0" />
          <stop offset="45%" stopColor="#a9d9bb" />
          <stop offset="100%" stopColor="#4f9f68" />
        </linearGradient>
        <linearGradient id="login-hill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f8f58" />
          <stop offset="100%" stopColor="#1f5c37" />
        </linearGradient>
      </defs>
      <rect width="400" height="640" fill="url(#login-sky)" />
      <g fill="#ffffff" opacity="0.55">
        <ellipse cx="90" cy="120" rx="55" ry="16" />
        <ellipse cx="150" cy="105" rx="40" ry="13" />
        <ellipse cx="280" cy="150" rx="60" ry="17" />
      </g>
      <path
        d="M0,360 C90,320 180,400 280,350 C330,325 370,360 400,340 L400,640 L0,640 Z"
        fill="url(#login-hill)"
      />
      <path
        d="M0,440 C120,400 220,470 320,430 C355,415 380,440 400,425 L400,640 L0,640 Z"
        fill="#164a2c"
      />
    </svg>
  );
}

export default function Login() {
 
  const [showPassword, setShowPassword] = useState(false);
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
      event.preventDefault();
    console.log('login handling')
  

  };

  return (
    <>
      <section className="bg-green-50/60 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-green-100 shadow-sm">
            <div className="grid lg:grid-cols-2">
              {/* Form panel */}
              <div className="bg-white p-6 sm:p-10">
                <div className="flex items-center gap-2">
                  <Logo />
                  <span className="text-base font-semibold text-slate-900">
                    Digital Heroes
                  </span>
                </div>

                <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[1.7rem]">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Log in to your account.
                </p>

                <form onSubmit={onSubmitHandler} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="loginEmail"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      id="loginEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="loginPassword"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((show) => !show)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-800 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                  >
                    Log in
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="font-medium text-green-700 hover:text-green-800"
                    >
                      Sign up
                    </a>
                  </p>
                </form>
              </div>

              {/* Course scene panel */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0">
                  <CourseScene />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-green-950/50 via-green-950/10 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-10 text-white">
                  <h2 className="text-3xl font-bold leading-tight">
                    Better scores.
                    <br />
                    Bigger impact.
                  </h2>
                  <Leaf
                    className="mt-4 h-5 w-5 text-white/90"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
