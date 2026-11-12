import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="Home"
      className="relative isolate min-h-150 overflow-hidden bg-white"
    >
      {/* Background image */}
      <img
        src="/image.png"
        alt="Golf course"
        className="absolute inset-0 z-0 h-full w-full object-cover object-right"
      />

      {/* White fade so text is easy to read */}
      <div className="absolute inset-0 z-10 bg-linear-to-r from-white via-white/80 to-transparent" />

      {/* Hero content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-green-900 sm:text-5xl lg:text-6xl">
            Play better.
            <br />
            Make a bigger impact.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-green-800">
            Track your golf scores, join monthly draws, win rewards, and support
            causes you care about — all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-md bg-green-800 px-8 py-3 text-center font-semibold text-white hover:bg-green-900"
            >
              Register
            </Link>

            <a
              href="#How-It-Works"
              className="rounded-md border border-green-700 bg-white/80 px-8 py-3 text-center font-semibold text-green-800 hover:bg-white"
            >
              How it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
