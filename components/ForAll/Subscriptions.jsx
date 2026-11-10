'use client'

import { useState } from "react";
import { Check, ShieldCheck, RotateCcw, Heart } from "lucide-react";

const plans = [
  {
    id: "monthly",
    name: "Monthly plan",
    price: "₹10000",
    period: "/month",
    description: "Flexible monthly membership.",
    features: [
      "Access to platform",
      "Enter golf scores",
      "Monthly draw entry",
      "Charity contribution",
    ],
    badge: null,
  },
  {
    id: "yearly",
    name: "Yearly plan",
    price: "₹96000",
    period: "/year",
    description: "Save more with yearly membership.",
    features: [
      "Access to platform",
      "Enter golf scores",
      "Monthly draw entry",
      "Charity contribution",
    ],
    badge: "Save 20%",
  },
];

const perks = [
  { icon: ShieldCheck, title: "Secure payments", detail: "Powered by Stripe" },
  { icon: RotateCcw, title: "Cancel anytime", detail: "No hidden fees" },
  { icon: Heart, title: "Make an impact", detail: "Support real charities" },
];

function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={selected}
      className={`relative w-full rounded-2xl border p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
        selected
          ? "border-green-600 bg-green-50/40 shadow-md ring-1 ring-green-600"
          : "border-green-100 bg-white"
      }`}
    >
      {plan.badge && (
        <span className="absolute right-5 top-5 rounded-md bg-green-700 px-2 py-1 text-[10px] font-bold text-white">
          {plan.badge}
        </span>
      )}

      <h3 className="text-sm font-semibold text-green-700">{plan.name}</h3>
      <p className="mt-1 text-xs text-gray-400">{plan.description}</p>

      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight text-green-950">
          {plan.price}
        </span>
        <span className="mb-1 text-xs text-gray-500">{plan.period}</span>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />
            {feature}
          </li>
        ))}
      </ul>

      <span
        className={`mt-7 block w-full rounded-md py-2.5 text-center text-sm font-semibold transition ${
          selected
            ? "bg-green-700 text-white"
            : "border border-green-300 bg-white text-green-700"
        }`}
      >
        {selected ? "Selected" : "Choose this plan"}
      </span>
    </button>
  );
}

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <section id="Subscriptions" className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-green-700">Choose your plan</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            Simple pricing. Bigger impact.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Choose the plan that works best for you.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Subscription plan"
          className="grid gap-6 md:grid-cols-2"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center ">
          <a
            type="button"
            href="/register"
            
            className="mt-10  block sm:w-1/2 w-full rounded-md py-2.5 text-center text-sm font-semibold transition bg-green-700 text-white"
          >
            Continue with {plans.find((p) => p.id === selectedPlan)?.name}
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-green-100 pt-6 sm:grid-cols-3 sm:gap-0">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className={`flex flex-col items-center text-center ${
                  index === 1 ? "sm:border-x sm:border-green-100" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-green-600" />
                <p className="mt-2 text-xs font-medium text-green-900">{perk.title}</p>
                <p className="mt-0.5 text-[10px] text-gray-400">{perk.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
