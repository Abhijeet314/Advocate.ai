import { FileText, AlignLeft, MessageSquare } from 'lucide-react';

interface SidebarProps {
  isFileUploaded: boolean;
  filename: string;
  activeTab: 'summary' | 'query';
  setActiveTab: (tab: 'summary' | 'query') => void;
}

export default function Sidebar({ isFileUploaded, filename, activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-full md:w-64 bg-gray-800 text-white p-4 md:min-h-screen">
      <div className="flex items-center space-x-2 mb-8">
        <FileText className="h-6 w-6" />
        <h1 className="text-xl font-bold">Legal Document AI</h1>
      </div>
      
      {isFileUploaded && (
        <>
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Current Document</h2>
            <div className="bg-gray-700 rounded p-3">
              <p className="font-medium truncate">{filename}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Analysis Tools</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('summary')}
                className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === 'summary' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <AlignLeft className="h-5 w-5" />
                <span>Document Summary</span>
              </button>
              
              <button
                onClick={() => setActiveTab('query')}
                className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === 'query' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Ask Questions</span>
              </button>
            </nav>
          </div>
        </>
      )}
      
      <div className="mt-auto">
        <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">About</h2>
        <p className="text-sm text-gray-300">
          Legal Document Analyzer uses AI to help legal professionals analyze and understand complex legal documents.
        </p>
      </div>
    </div>
  );
}
