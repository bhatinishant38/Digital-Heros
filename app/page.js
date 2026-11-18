import Charities from '@/components/ForAll/Charities'
import Hero from '@/components/ForAll/Hero'
import HowItWorks from '@/components/ForAll/HowItWorks'
import Impact from '@/components/ForAll/Impact'
import Navbar from '@/components/ForAll/Navbar'
import Subscriptions from '@/components/ForAll/Subscriptions'
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import React from 'react'

export const instant = false;

const page = async () => {
  await connection();
  const session = await auth();

  if (session?.user?.role === "admin") {
    redirect("/admin/adminDashboard");
  }
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Navbar/>
      <Hero/>
      <HowItWorks/>
      <Charities/>
      <Subscriptions/>
      <Impact/>
      
    </div>
  )
}

export default page