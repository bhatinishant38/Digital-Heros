import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import AdminSidebar from "@/components/ForAdmin/AdminSidebar";
import { AdminContextProvider } from "@/context/AdminContext";
import { connection } from "next/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Digital Heroes",
  description: "Manage the Digital Heroes platform.",
};

async function AdminLayoutContent({ children }) {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AdminContextProvider>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </AdminContextProvider>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense
      fallback={<p className="p-6 text-gray-500">Loading admin panel...</p>}
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}