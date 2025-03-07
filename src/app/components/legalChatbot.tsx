import React from 'react';
import Head from 'next/head';
import ChatWidget from './ChatWidget';

export default function LegalChatbot() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Legal Assistant | Advocate.ai</title>
        <meta name="description" content="Your AI-powered legal assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-6">Advocate.ai</h1>
        <p className="text-center text-lg mb-8">Your AI-powered legal assistant for all legal queries and information.</p>
        
        {/* Main content here */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">How Advocate.ai Can Help You</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full text-blue-800 mr-2">✓</span>
              <span>Get answers to complex legal questions</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full text-blue-800 mr-2">✓</span>
              <span>Learn about specific laws and regulations</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full text-blue-800 mr-2">✓</span>
              <span>Understand legal documents and terminology</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 p-1 rounded-full text-blue-800 mr-2">✓</span>
              <span>Get examples of legal cases and precedents</span>
            </li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
            <p className="font-medium text-gray-700">Note: Advocate.ai provides information for educational purposes only and is not a substitute for professional legal advice.</p>
          </div>
        </div>
      </main>

      {/* Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}