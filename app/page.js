import Charities from '@/components/ForAll/Charities'
import Hero from '@/components/ForAll/Hero'
import HowItWorks from '@/components/ForAll/HowItWorks'
import Impact from '@/components/ForAll/Impact'
import Navbar from '@/components/ForAll/Navbar'
import Subscriptions from '@/components/ForAll/Subscriptions'
import React from 'react'

const page = () => {
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