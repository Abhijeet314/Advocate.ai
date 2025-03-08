import { FileText, Users, Calendar, Book, Scale, AlertTriangle, FileCheck } from 'lucide-react';
import { DocumentSummaryType } from '../app/types/documentTypes';

interface DocumentSummaryProps {
  summary: DocumentSummaryType | null;
  filename: string;
  isLoading: boolean;
}

export default function DocumentSummary({ summary, filename, isLoading }: DocumentSummaryProps) {
  if (!summary && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600">Document analysis not available. Please analyze the document.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Document Summary</h2>
        <p className="text-gray-600">{filename}</p>
      </div>
      
      {summary && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Document Type</h3>
              </div>
              <p className="text-gray-700">{summary.document_type}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Parties Involved</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {summary.parties_involved.map((party, index) => (
                  <li key={index}>{party}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Key Dates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.key_dates.map((dateItem, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium">{dateItem.date}</p>
                  <p className="text-gray-600 text-sm">{dateItem.context}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Primary Subjects</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {summary.primary_subjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Scale className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Key Provisions</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {summary.key_provisions.map((provision, index) => (
                  <li key={index}>{provision}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Critical Obligations</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {summary.critical_obligations.map((obligation, index) => (
                  <li key={index}>{obligation}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Potential Issues</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {summary.potential_issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Document Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{summary.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}