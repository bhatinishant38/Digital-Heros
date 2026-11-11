import Sidebar from "@/components/ForUser/sidebar"


export const metadata = {
  title: 'Dashboard | Mystery Message',
  description: 'Manage your messages and profile link.',
}


export default function DashboardLayout({ children} ){

  return <main className='flex-1 flex'>
        <div><Sidebar /></div>
        <div>{children}</div>  
    </main>
}