import {
  GraduationCap,
  HeartPulse,
  Leaf,
  Utensils,
  PawPrint,
  HandHeart,
} from "lucide-react";

const causes = [
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Helping children and communities access quality education and better opportunities.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "Supporting people who need medical care, treatment, and essential health services.",
  },
  {
    icon: Leaf,
    title: "Environment",
    description:
      "Protecting our planet through sustainability, conservation, and environmental initiatives.",
  },
  {
    icon: Utensils,
    title: "Food & Hunger",
    description:
      "Fighting hunger by helping provide nutritious meals to families and communities.",
  },
  {
    icon: PawPrint,
    title: "Animal Welfare",
    description:
      "Supporting the care, protection, and well-being of animals in need.",
  },
  {
    icon: HandHeart,
    title: "Disaster Relief",
    description:
      "Providing essential support to communities affected by natural disasters and emergencies.",
  },
];

const Charities = () => {
  return (
    <section className="bg-white py-20 px-6" id="Charities">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            Making an Impact
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Digital Heroes Support
            <span className="text-green-600"> Every Cause</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            At Digital Heroes, we believe every act of kindness can create
            meaningful change. Our charity initiatives support people,
            communities, animals, and our planet across different fields.
          </p>
        </div>

        {/* Cause Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {causes.map((cause) => {
            const Icon = cause.icon;

            return (
              <div
                key={cause.title}
                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white">
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  {cause.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {cause.description}
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-green-500 transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

       

      </div>
    </section>
  );
};

export default Charities;