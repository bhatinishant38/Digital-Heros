import {
  CreditCard,
  ClipboardList,
  Gift,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Subscribe",
    body: "Choose a plan and complete your payment.",
  },
  {
    icon: ClipboardList,
    title: "Enter scores",
    body: "Add your last 5 golf scores in Stableford format.",
  },
  {
    icon: Gift,
    title: "Join the draw",
    body: "Get automatically entered into the monthly prize draw.",
  },
  {
    icon: HeartHandshake,
    title: "Support charity",
    body: "Help fund a charity of your choice.",
  },
];

export default function HowItWorks() {
  return (
    <section id="How-It-Works" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-700">
            Simple process
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            How it works
          </h2>

          <p className="mt-3 text-base leading-relaxed text-gray-500 sm:text-lg">
            A simple 4-step journey to play, win and give back.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="group relative rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                {/* Number */}
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>

                  <span className="text-4xl font-bold text-green-100">
                    0{index + 1}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-green-950">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.body}
                </p>

                
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}