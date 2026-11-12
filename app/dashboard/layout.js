import Sidebar from "@/components/ForUser/sidebar";

export const metadata = {
  title: 'Dashboard | Mystery Message',
  description: 'Manage your messages and profile link.',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}