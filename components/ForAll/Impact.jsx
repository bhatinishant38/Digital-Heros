import { Users, Trophy, Landmark, Gift } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Active members" },
  { icon: Trophy, value: "50+", label: "Charities supported" },
  { icon: Landmark, value: "$100K+", label: "Total donations" },
  { icon: Gift, value: "12+", label: "Monthly draws" },
];

export default function Impact() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="rounded-2xl bg-linear-to-r from-green-50 to-emerald-50 px-6 py-8 sm:px-10 sm:py-9">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Together we've made an impact
          </h2>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <dt className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {stat.value}
                  </dt>
                  <dd className="text-xs text-slate-500 sm:text-sm">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
