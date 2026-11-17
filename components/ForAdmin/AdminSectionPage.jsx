export default function AdminSectionPage({ title, description }) {
  return (
    <main className="mx-auto w-full max-w-6xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold text-green-950">{title}</h1>
      </header>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-2 text-sm text-gray-500">
          Management tools for this section have not been added yet.
        </p>
      </section>
    </main>
  );
}
