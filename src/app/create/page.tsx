"use client"
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define types for our data structures
type AnswersType = Record<string, string>;

interface DocumentResponse {
  document: {
    id: string;
  };
}

export default function CreateDocument() {
  const [docType, setDocType] = useState<string>('');
  const [language, setLanguage] = useState<string>('English');
  const [title, setTitle] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<AnswersType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [generatingDoc, setGeneratingDoc] = useState<boolean>(false);
  const router = useRouter();

  const docTypes: string[] = [
    'Lease Agreement',
    'Employment Contract',
    'Non-Disclosure Agreement',
    'Partnership Agreement',
    'Bill of Sale',
    'Power of Attorney',
    'Promissory Note',
    'Terms of Service',
    'Privacy Policy',
    'Will and Testament'
  ];

  const fetchQuestions = async (): Promise<void> => {
    if (!docType) return;
    
    try {
      setLoading(true);
      const response = await fetch('https://legaldocgeneration.onrender.com/generate_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doc_type: docType, language }),
      });
      
      const data = await response.json();
      setQuestions(data.questions);
      
      // Initialize answers object
      const initialAnswers: AnswersType = {};
      data.questions.forEach((q: string) => {
        initialAnswers[q] = '';
      });
      setAnswers(initialAnswers);
      
      setLoading(false);
      setStep(2);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleGenerateDocument = async (): Promise<void> => {
    try {
      setGeneratingDoc(true);
      const response = await fetch('https://legaldocgeneration.onrender.com/generate_document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc_type: docType,
          title: title || `${docType} Document`,
          language,
          answers,
        }),
      });
      
      const data: DocumentResponse = await response.json();
      setGeneratingDoc(false);
      
      // Navigate to the edit page for the new document
      router.push(`/edit/${data.document.id}`);
    } catch (error) {
      console.error('Error generating document:', error);
      setGeneratingDoc(false);
    }
  };

  const handleAnswerChange = (question: string, value: string): void => {
    setAnswers({
      ...answers,
      [question]: value,
    });
  };

  const handleBack = (): void => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleDocTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setDocType(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setLanguage(e.target.value);
  };

  const handleCustomDocTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDocType(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Document</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Back to Documents
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Step indicator */}
            <div className="border-b border-gray-200">
              <nav className="flex" aria-label="Progress">
                <ol className="flex items-center w-full">
                  <li className={`relative pr-8 sm:pr-20 flex-1 ${step === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <span className="ml-4 text-sm font-medium">Document Type</span>
                    </div>
                  </li>
                  
                  <li className={`relative pr-8 sm:pr-20 flex-1 ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <span className="ml-4 text-sm font-medium">Document Details</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            
            <div className="p-6">
              {step === 1 && (
                <>
                  <div className="mb-6">
                    <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <select
                      id="docType"
                      value={docType}
                      onChange={handleDocTypeChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select document type</option>
                      {docTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      <option value="custom">Custom Document Type</option>
                    </select>
                    
                    {docType === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom document type"
                        className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleCustomDocTypeChange}
                      />
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder={docType ? `${docType} Document` : "Enter document title"}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={handleLanguageChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={fetchQuestions}
                      disabled={!docType || loading}
                      className={`${
                        !docType || loading
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {loading ? 'Loading...' : 'Continue'}
                    </button>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {docType} Details
                  </h3>
                  
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {question}
                        </label>
                        <input
                          type="text"
                          value={answers[question] || ''}
                          onChange={(e) => handleAnswerChange(question, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleGenerateDocument}
                      disabled={generatingDoc}
                      className={`${
                        generatingDoc
                          ? 'bg-blue-400 cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {generatingDoc ? 'Generating...' : 'Generate Document'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}