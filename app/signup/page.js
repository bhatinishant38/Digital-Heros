'use client'
import {  useState } from "react";
import { Eye, EyeOff, Leaf } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Router } from "next/router";



function GolferIllustration() {
  return (
    <svg
      viewBox="0 0 240 260"
      aria-hidden="true"
      className="mx-auto h-56 w-56 lg:h-64 lg:w-64"
    >
      <ellipse cx="120" cy="240" rx="80" ry="14" fill="#bfe3c8" opacity="0.6" />
      <circle
        cx="150"
        cy="90"
        r="58"
        fill="none"
        stroke="#7fc794"
        strokeWidth="6"
      />
      <g fill="#2f7a49">
        <circle cx="150" cy="55" r="14" />
        <path d="M150 68 C130 80 128 110 132 140 L124 210 L138 210 L148 150 L158 210 L172 210 L168 138 C176 108 172 80 150 68Z" />
        <path d="M132 90 C110 100 96 118 90 138 L100 144 C108 126 118 112 134 104Z" />
      </g>
      <rect
        x="88"
        y="132"
        width="6"
        height="60"
        rx="3"
        fill="#1f5c37"
        transform="rotate(20 91 132)"
      />
    </svg>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7">
      <defs>
        <linearGradient id="dh-logo-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <path
        fill="url(#dh-logo-2)"
        d="M16 2.5 28 6.4v9.2c0 6.6-4.6 12.3-12 14.4C8.6 27.9 4 22.2 4 15.6V6.4L16 2.5Z"
      />
      <path
        fill="#fff"
        d="M11 11h4.5v3.2H11V11Zm5.6 0H21v3.2h-4.4V11Zm-5.6 4.4h4.5v3.2H11v-3.2Zm5.6 0H21v7.2h-4.4v-7.2Z"
      />
    </svg>
  );
}



export default function Register() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if(!agreed){
        alert("please accept the terms and conditions.")
        return
      }
      const {data} = await axios.post(`/api/auth/signup` ,{username ,email ,password})
      if(data.success){
        console.log("User registered successfully:",data.user)
        setUserName('')
        setEmail('')
        toast.success(data.message)  
        router.push('/login')
        
      }
      
    } catch (error) {
      
    }
    console.log('handling signup')
  };

  return (
    <section className="bg-green-50/60 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-green-100 bg-white/60 shadow-sm">
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
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Join a community that plays for a purpose.
              </p>

              <form onSubmit={onSubmitHandler} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
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
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a password"
                      autoComplete="new-password"
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
                

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600/30"
                  />
                  I agree to the Terms &amp; Conditions
                </label>

                <button
                  type="submit"
                  disabled={!agreed}
                  className="w-full rounded-lg bg-green-800 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Create account
                </button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-green-700 hover:text-green-800"
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>

            {/* Illustration panel */}
            <div className="hidden flex-col items-center justify-center bg-linear-to-b from-green-50 to-green-100/70 p-10 text-center lg:flex">
              <GolferIllustration />
              <h2 className="mt-4 text-2xl font-bold text-green-900">
                More than just golf.
              </h2>
              <p className="mt-2 max-w-[16rem] text-sm text-green-700">
                Better scores. Bigger rewards. Greater impact.
              </p>
              <Leaf className="mt-5 h-5 w-5 text-green-600" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
