import React from 'react'

import ChatWidget from '../components/ChatWidget'
import HealthcareHero from '@/sections/hero/hero'
import { Features } from '@/sections/features/features'
import Footer from '@/sections/footer/footer'
import { Pricing } from '@/sections/pricing/pricing'

function page() {
  return (
    <div>
      

      <ChatWidget />

      <HealthcareHero/>
      <Features/>
      <Pricing/>
      <Footer/>
         </div>

  )
}

export default page