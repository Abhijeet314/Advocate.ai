import { useState } from 'react';
import { Send, MessageSquare, FileText, Scale, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { DocumentQueryResponse } from '../app/types/documentTypes';

interface QuerySectionProps {
  onQuery: (query: string) => void;
  queryResponses: DocumentQueryResponse[];
  isLoading: boolean;
}

export default function QuerySection({ onQuery, queryResponses, isLoading }: QuerySectionProps) {
  const [queryText, setQueryText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      onQuery(queryText);
      setQueryText('');
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ask Questions About Your Document</h2>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="e.g., What are the termination conditions?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !queryText.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Ask specific questions about the document content, obligations, or potential issues.
          </p>
        </form>
      </div>

      {queryResponses.length > 0 && (
        <div className="space-y-6">
          {queryResponses.map((response) => (
            <div key={response.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-800">{response.queryText}</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {response.timestamp && formatDateTime(response.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Interpretation</h4>
                  <p className="text-gray-700">{response.interpretation}</p>
                </div>
                
                {response.direct_references && response.direct_references.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Direct References</h4>
                    </div>
                    <div className="space-y-3">
                      {response.direct_references.map((ref, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded border-l-2 border-blue-500">
                          <p className="text-gray-700 mb-1">{ref.text}</p>
                          <p className="text-sm text-gray-500">Location: {ref.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Scale className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Related Principles</h4>
                    </div>
                    <ul className="list-disc list-inside text-gray-700">
                      {response.related_principles.map((principle, index) => (
                        <li key={index}>{principle}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Strategic Insights</h4>
                    </div>
                    <ul className="list-disc list-inside text-gray-700">
                      {response.strategic_insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Limitations</h4>
                    </div>
                    <ul className="list-disc list-inside text-gray-700">
                      {response.limitations.map((limitation, index) => (
                        <li key={index}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Recommended Actions</h4>
                    </div>
                    <ul className="list-disc list-inside text-gray-700">
                      {response.recommended_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {queryResponses.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600">No queries yet. Ask a question about your document.</p>
        </div>
      )}
    </div>
  );
}