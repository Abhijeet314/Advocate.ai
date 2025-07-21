'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';

const HealthcareHero: React.FC = () => {

  return (
    <>
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Hero Content */}
      <main className="relative z-20 px-6 pt-20 pb-24 max-w-7xl mx-auto flex flex-row-2">
        <div className="flex flex-col items-start  mb-16">
            <Link href="/sign-up"><button className="inline-block px-6 py-2 rounded-full border border-gray-500 text-black mb-8 cursor-pointer">
            New Feature&apos;s Are Live →
            </button></Link>
          
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="text-black">Revolutionizing</span><br />
            <span className="text-blue-500">Legal Sector</span>
            <span className="text-black"> using AI</span>
          </h1>

          
        </div>

        {/* Bottom content */}
       
          
          {/* <div className="text-right">
            <h2 className="text-white text-4xl font-bold mb-4">Live Well, Be Well</h2>
            <p className="text-gray-400 max-w-lg ml-auto">
              Embrace a healthier tomorrow with AI-driven healthcare. Our 
              technology ensures that wellness is not just a goal, but a way 
              of life. Design by Fluttertop Experience the synergy of 
              technology and personal care tailored just for you.
            </p>
            
            <div className="flex items-center justify-end mt-6">
              <div className="flex -space-x-4 mr-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                    <div className="w-full h-full bg-white rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        {/* </div> */}
        <Image src="/heropage.png" alt="chatbot" width={400} height={400} />
        <ChatWidget/>

      </main>
      
    </div>
    </>
  );
};

export default HealthcareHero;