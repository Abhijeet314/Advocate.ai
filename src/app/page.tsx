import React from 'react'

import { Navbar } from '../sections/navbar/navbar'
import ChatWidget from '../components/ChatWidget'


import HeroSection from '@/sections/hero/hero'
import HealthcareHero from '@/sections/hero/hero'
import { Features } from '@/sections/features/features'
import Footer from '@/sections/footer/footer'





function page() {
  return (
    <div>
      

      <ChatWidget />

      <HealthcareHero/>
      <Features/>
      <Footer/>
         </div>

  )
}

export default page