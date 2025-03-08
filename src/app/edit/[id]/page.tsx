"use client"
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Define interfaces for our data types
interface DocumentData {
  id: string;
  title: string;
  document_text: string;
  doc_type: string;
  language: string;
  answers?: Record<string, string>;
}

interface ApiResponse {
  document: DocumentData;
}

type AnswersType = Record<string, string>;

export default function EditDocument() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [answers, setAnswers] = useState<AnswersType>({});
  const [editMode, setEditMode] = useState<'direct' | 'answers'>('direct'); 
  const [regenerating, setRegenerating] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);
  
  const fetchDocument = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`https://legaldocgeneration.onrender.com/documents/${id}`);
      const data: ApiResponse = await response.json();
      
      if (data.document) {
        setDocument(data.document);
        setDocumentText(data.document.document_text);
        setTitle(data.document.title);
        setAnswers(data.document.answers || {});
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching document:', error);
      setLoading(false);
    }
  };
  
  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
      
      const updatePayload = {
        title,
        document_text: documentText,
      };
      
      const response = await fetch(`https://legaldocgeneration.onrender.com/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.document) {
        setDocument(data.document);
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving document:', error);
      setSaving(false);
    }
  };
  
  const handleRegenerateFromAnswers = async (): Promise<void> => {
    try {
      setRegenerating(true);
      
      const updatePayload = {
        answers,
        regenerate: true,
      };
      
      const response = await fetch(`https://legaldocgeneration.onrender.com/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.document) {
        setDocument(data.document);
        setDocumentText(data.document.document_text);
      }
      
      setRegenerating(false);
      setEditMode('direct');
    } catch (error) {
      console.error('Error regenerating document:', error);
      setRegenerating(false);
    }
  };
  
  const handleAnswerChange = (question: string, value: string): void => {
    setAnswers({
      ...answers,
      [question]: value,
    });
  };
  
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleDocumentTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setDocumentText(e.target.value);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Document not found</h2>
          <p className="mt-1 text-gray-500">The document you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-0 py-1 rounded"
            />
            <p className="text-sm text-gray-500 mt-1">{document.doc_type} • {document.language}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${
                saving ? 'bg-green-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Edit Document</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => setEditMode('direct')}
                        className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                          editMode === 'direct'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Direct Edit
                      </button>
                      <button
                        onClick={() => setEditMode('answers')}
                        className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                          editMode === 'answers'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {editMode === 'direct' ? (
                <textarea
                  value={documentText}
                  onChange={handleDocumentTextChange}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              ) : (
                <div className="space-y-6">
                  {Object.entries(answers).map(([question, answer], index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question}
                      </label>
                      <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleRegenerateFromAnswers}
                      disabled={regenerating}
                      className={`${
                        regenerating
                          ? 'bg-blue-400 cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {regenerating ? 'Regenerating...' : 'Regenerate Document'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}