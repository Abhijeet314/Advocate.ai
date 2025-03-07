import React from 'react'

import { Navbar } from '../sections/navbar/navbar'
import ChatWidget from '../components/ChatWidget'

function page() {
  return (
    <div>
      <Navbar/>
      <ChatWidget />
    </div>
  )
}

export default page