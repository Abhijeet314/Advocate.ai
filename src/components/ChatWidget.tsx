"use client"
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

// We'll generate IDs on the client side
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello, I am Advocate.ai, your Legal Assistant. How can I help with your legal questions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Initialize conversation ID safely on client side
  useEffect(() => {
    if (!isInitialized.current) {
      let savedId;
      try {
        savedId = localStorage.getItem('advocateAiConversationId');
      } catch (e) {
        console.warn('localStorage is not available:', e);
      }
      
      setConversationId(savedId || generateId());
      isInitialized.current = true;
    }
  }, []);

  // Save conversation ID to localStorage safely
  useEffect(() => {
    if (conversationId && typeof window !== 'undefined') {
      try {
        localStorage.setItem('advocateAiConversationId', conversationId);
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://legalchatbot-wf3i.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          conversationId: conversationId || generateId()
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response || 'No response received' }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered a network error. Please check your connection and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    // Clear chat UI
    setMessages([
      { role: 'assistant', content: 'Hello, I am Advocate.ai, your Legal Assistant. How can I help with your legal questions today?' }
    ]);
    
    // Generate a new conversation ID
    const newConversationId = generateId();
    setConversationId(newConversationId);
    
    // Clear conversation history on the server
    try {
      await fetch('https://legalchatbot-wf3i.onrender.com/clear-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId
        }),
      });
    } catch (error) {
      console.error('Failed to clear conversation history on server:', error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Custom components for ReactMarkdown with proper TypeScript typing
  const MarkdownComponents: Components = {
    h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
    h2: ({children}) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
    h3: ({children}) => <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>,
    p: ({children}) => <p className="mb-3">{children}</p>,
    ul: ({children}) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
    li: ({children}) => <li className="mb-1">{children}</li>,
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => <code className="font-mono bg-gray-100 px-1 rounded">{children}</code>,
    a: ({href, children}) => <a href={href} className="text-blue-600 underline">{children}</a>,
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition-all z-50"
        aria-label="Chat with Advocate.ai"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        )}
      </button>
      <div 
        className={`fixed ${isExpanded ? 'top-25 bottom-25 right-4 left-4 sm:left-auto sm:w-2/3 md:w-1/2 lg:w-1/3' : 'bottom-20 right-4 w-full sm:w-96 h-96'} bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h3 className="font-medium">Advocate.ai</h3>
          </div>
          <div className="flex">
            <button 
              onClick={toggleExpand}
              className="mr-3 text-white hover:text-gray-200"
              aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
            >
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
            <button 
              onClick={clearChat}
              className="mr-3 text-sm hover:underline"
              aria-label="Clear chat"
            >
              New Chat
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block rounded-lg px-4 py-2 max-w-xs sm:max-w-sm break-words ${
                  message.role === 'user' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown components={MarkdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block rounded-lg px-4 py-2 bg-white text-gray-800 border border-gray-200">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 rounded-r-lg flex items-center justify-center disabled:bg-blue-400"
              disabled={isLoading || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is an AI legal assistant. For professional legal advice, please consult a qualified attorney.
          </p>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;