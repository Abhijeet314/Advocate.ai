import React from 'react'

import { Navbar } from '../sections/navbar/navbar'
import ChatWidget from '../components/ChatWidget'


import HeroSection from '@/sections/hero/hero'
import HealthcareHero from '@/sections/hero/hero'
import { Features } from '@/sections/features/features'
import { Pricing } from '@/sections/pricing/pricing'




function page() {
  return (
    <div>
      <Navbar/>

      <ChatWidget />

      <HealthcareHero/>
      <Features/>
      <Pricing/>
         </div>

  )
}

export default page