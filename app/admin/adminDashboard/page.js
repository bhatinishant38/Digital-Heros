import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection } from "next/server";
import { redirect } from "next/navigation";

async function AdminDashboardContent() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-green-950">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Signed in as {session.user.email}.
      </p>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading admin dashboard...</p>}>
      <AdminDashboardContent />
    </Suspense>
  );
}