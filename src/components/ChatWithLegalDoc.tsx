// File: pages/index.tsx
"use client"
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import UploadSection from '../components/UploadSection';
import DocumentSummary from '../components/DocumentSummary';
import QuerySection from '../components/QuerySection';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { DocumentSummaryType, DocumentQueryResponse } from '../app/types/documentTypes';

export default function ChatWithLegalDoc() {
  const [sessionId, setSessionId] = useState<string>('');
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentSummary, setDocumentSummary] = useState<DocumentSummaryType | null>(null);
  const [queryResponses, setQueryResponses] = useState<DocumentQueryResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'summary' | 'query'>('summary');

  useEffect(() => {
    // Generate a session ID when the component mounts
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    // Clean up function - delete session when component unmounts
    return () => {
      if (sessionId) {
        fetch(`https://chatwithlegal.onrender.com/api/sessions/${sessionId}`, { method: 'DELETE' })
          .catch(err => console.error('Error deleting session:', err));
      }
    };
  }, [sessionId]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);
    
    try {
      const response = await fetch('https://chatwithlegal.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }
      
      setIsFileUploaded(true);
      setFilename(data.filename);
      
      // Automatically analyze the document after upload
      await analyzeDocument();
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during file upload');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeDocument = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://chatwithlegal.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze document');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during document analysis');
      }
    } finally {
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred during document analysis');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuery = async (query: string) => {
    if (!query.trim()) {
      setError('Query cannot be empty');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://chatwithlegal.onrender.com/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          query: query 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process query');
      }
      
    // Add timestamp and query text to response for display purposes
    const newResponse: DocumentQueryResponse = {

      response: data.response,
      timestamp: new Date().toISOString(),
    };
    setQueryResponses(prev => [...prev, newResponse]);
    setActiveTab('query');
    
  } catch (err: any) {
    setError(err.message || 'An error occurred while processing your query');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Legal Document Analyzer</title>
        <meta name="description" content="AI-powered legal document analysis tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar 
          isFileUploaded={isFileUploaded} 
          filename={filename}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Legal Document Analyzer</h1>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {!isFileUploaded ? (
              <UploadSection onFileUpload={handleFileUpload} isLoading={isLoading} />
            ) : (
              <div>
                {activeTab === 'summary' && (
                  <DocumentSummary 
                    summary={documentSummary} 
                    filename={filename}
                    isLoading={isLoading} 
                  />
                )}
                
                {activeTab === 'query' && (
                  <QuerySection 
                    onQuery={handleQuery} 
                    queryResponses={queryResponses}
                    isLoading={isLoading} 
                  />
                )}
              </div>
            )}
            
            {isLoading && <LoadingSpinner />}
          </div>
        </main>
      </div>
    </div>
  );
}
