"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/sections/navbar/navbar';

// Define interface for document object
interface Document {
  id: string;
  title: string;
  doc_type: string;
  document_text: string;
  language: string;
}

export default function LegalDocGeneration() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://legaldocgeneration.onrender.com/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const handleNewDocument = () => {
    router.push('/create');
  };

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await fetch(`https://legaldocgeneration.onrender.com/documents/${id}`, {
          method: 'DELETE',
        });
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Generator</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
            <button
              onClick={handleNewDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
            >
              Create New Document
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new document.</p>
              <div className="mt-6">
                <button
                  onClick={handleNewDocument}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Document
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Link href={`/edit/${doc.id}`} key={doc.id}>
                  <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                    <div className="px-4 py-5 sm:p-6 flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{doc.title}</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {doc.doc_type}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-500 line-clamp-3">{doc.document_text}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{doc.language}</span>
                      <button
                        onClick={(e) => handleDeleteDocument(doc.id, e)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
}