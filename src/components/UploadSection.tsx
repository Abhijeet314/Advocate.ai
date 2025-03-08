import { useState, useRef } from 'react';
import { FileText, Upload } from 'lucide-react';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function UploadSection({ onFileUpload, isLoading }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Legal Document</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-10 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        
        <p className="text-lg text-gray-600 mb-2">
          Drag and drop your document here, or click to browse
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Supported formats: PDF, DOCX, TXT (Max 16MB)
        </p>
        
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.docx,.txt"
          disabled={isLoading}
        />
        
        <button
          onClick={onButtonClick}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          <Upload className="h-5 w-5 mr-2" />
          Browse Files
        </button>
      </div>
    </div>
  );
}
