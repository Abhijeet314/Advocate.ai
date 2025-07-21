"use client"
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaGavel, 
  FaInfoCircle, 
  FaLightbulb, 
  FaBalanceScale, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const API_URL = 'https://legalresearchassitance.onrender.com';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

// Types
interface PrecedentType {
  case: string;
  outcome: string;
}

interface AnalysisResultType {
  key_principles: string[];
  patterns: string[];
  precedents: PrecedentType[];
  recommendations: string[];
  risk_factors: string[];
  strong_arguments: string[];
  likely_outcome: string;
  response_time?: string;
  error?: string;
}

export default function LegalResearchAssitant() {
  // Form state
  const [caseType, setCaseType] = useState('');
  const [oppositionDemand, setOppositionDemand] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  
  // Analysis state
  const [isLoading, setIsLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [activeTab, setActiveTab] = useState('principles');
  
  // Load example data
  const loadExample = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/example`);
      setCaseType(response.data.case_type);
      setOppositionDemand(response.data.opposition_demand);
      setAdditionalDetails(response.data.additional_details);
      setShowExample(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading example:', error);
      setIsLoading(false);
    }
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseType || !oppositionDemand) {
      alert('Please provide both case type and opposition demand');
      return;
    }
    
    try {
      setIsLoading(true);
      setAnalysisResult(null);
      
      const response = await axios.post(`${API_URL}/api/analyze`, {
        case_type: caseType,
        opposition_demand: oppositionDemand,
        additional_details: additionalDetails
      });
      
      setAnalysisResult(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error analyzing case:', error);
      setIsLoading(false);
      setAnalysisResult({
        key_principles: ['Error occurred while analyzing the case'],
        patterns: [],
        precedents: [],
        recommendations: ['Please try again later'],
        risk_factors: [],
        strong_arguments: [],
        likely_outcome: 'Analysis failed'
      });
    }
  };
  
  return (
    <>
    <div className="min-h-screen">
      <Head>
        <meta name="description" content="AI-powered legal insights for lawyers" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-primary-700">
            <FaGavel className="inline-block mr-2 mb-1" />
            Legal Research Assistant
          </h1>
          <p className="text-xl text-white mt-2">
            AI-powered legal insights to help lawyers build stronger cases
          </p>
        </motion.div>
        
        {/* Disclaimer */}
        <div className="bg-secondary-50 border-l-4 border-secondary-600 p-4 rounded mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-black">
                <strong>Disclaimer:</strong> This tool uses AI to provide legal insights based on available knowledge of Indian law. 
                The analysis should be used as a starting point for your legal research and not as a substitute for professional legal advice. 
                Always verify information with primary legal sources and consult with qualified legal professionals.
              </p>
            </div>
          </div>
        </div>
        
        {/* Case Details Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Case Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
                    Case Type
                  </label>
                  <input
                    id="caseType"
                    type="text"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    placeholder="e.g., Property Dispute, Criminal, Family Law"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="oppositionDemand" className="block text-sm font-medium text-gray-700 mb-1">
                    Oppositions Demand/Claim
                  </label>
                  <input
                    id="oppositionDemand"
                    type="text"
                    value={oppositionDemand}
                    onChange={(e) => setOppositionDemand(e.target.value)}
                    placeholder="What is the opposing party demanding?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-black mb-1">
                  Additional Case Details
                </label>
                <textarea
                  id="additionalDetails"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Include key facts, applicable laws, your client's position..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 h-32"
                />
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={loadExample}
                className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaInfoCircle className="mr-2" /> Load Example
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border  text-base font-medium  border-black rounded-md shadow-sm text-black bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Analyze Case <FaArrowRight className="ml-2" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Example Information */}
        {showExample && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200"
          >
            <h3 className="font-medium text-blue-800 mb-2">Example Case Details</h3>
            <p className="text-sm text-blue-700 mb-1">
              <strong>Case Type:</strong> {caseType}
            </p>
            <p className="text-sm text-blue-700 mb-1">
              <strong>Oppositions Demand:</strong> {oppositionDemand}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Additional Details:</strong> {additionalDetails}
            </p>
          </motion.div>
        )}
        
        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 bg-primary-700 text-white">
                <h2 className="text-2xl font-semibold flex items-center">
                  <FaBalanceScale className="mr-2" /> Legal Analysis
                </h2>
                {analysisResult.response_time && (
                  <p className="text-sm opacity-80">Analysis completed in {analysisResult.response_time}</p>
                )}
              </div>
              
              {/* Likely Outcome */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Likely Outcome</h3>
                <p className="text-gray-700">{analysisResult.likely_outcome}</p>
              </div>
              
              {/* Strong Arguments */}
              <div className="p-6 bg-green-50 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FaLightbulb className="text-green-600 mr-2" /> Strong Arguments for Your Case
                </h3>
                <div className="space-y-3">
  {analysisResult?.strong_arguments?.length > 0 ? (
    analysisResult.strong_arguments.map((argument, index) => (
      <div key={index} className="pl-4 border-l-4 border-green-500">
        <p className="text-gray-700">{argument}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No strong arguments found.</p>
  )}
</div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('principles')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === 'principles'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Key Principles & Patterns
                  </button>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === 'recommendations'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Recommendations
                  </button>
                  <button
                    onClick={() => setActiveTab('risks')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === 'risks'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Risk Factors
                  </button>
                  <button
                    onClick={() => setActiveTab('precedents')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === 'precedents'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Precedents
                  </button>
                </nav>
              </div>
              
              {/* Tab Panels */}
              <div className="p-6">
                {activeTab === 'principles' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Key Legal Principles</h3>
                      <ul className="space-y-2">
                        {analysisResult.key_principles.map((principle, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 text-primary-600 mr-2">•</span>
                            <span className="text-gray-700">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Common Patterns</h3>
                      <ul className="space-y-2">
                        {analysisResult.patterns.map((pattern, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 text-primary-600 mr-2">•</span>
                            <span className="text-gray-700">{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'recommendations' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Recommendations</h3>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 bg-primary-100 text-primary-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'risks' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factors to Consider</h3>
                    <ul className="space-y-3">
                      {analysisResult.risk_factors.map((risk, index) => (
                        <li key={index} className="flex items-start bg-yellow-50 p-3 rounded">
                          <FaExclamationTriangle className="flex-shrink-0 text-yellow-500 mt-1 mr-3" />
                          <span className="text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'precedents' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Relevant Precedents</h3>
                    <div className="space-y-4">
                      {analysisResult.precedents.map((precedent, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 px-4 py-2 font-medium">
                            {precedent.case}
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700">{precedent.outcome}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-primary-700 mb-4">Next Steps</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-gray-700">
                  <span className="font-medium">Review the analysis</span> and identify which arguments align with your case strategy
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Research the cited precedents</span> in legal databases for more detailed information
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Consult with colleagues</span> to refine your approach based on these insights
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Prepare documentation</span> that strengthens your position on the key legal principles
                </li>
              </ol>
            </div>
          </motion.div>
        )}
        
        {/* About this Tool */}
        <div className="mt-8">
          <details className="bg-white rounded-lg shadow-md overflow-hidden">
            <summary className="cursor-pointer px-6 py-4 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-colors">
              About this Tool
            </summary>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How it Works</h3>
              <p className="text-gray-700 mb-4">
                This tool uses advanced AI language models to analyze your case details and provide structured legal insights based on its knowledge of Indian law, precedents, and legal principles.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Current Capabilities</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li className="text-gray-700">Analysis of legal cases across various domains of Indian law</li>
                <li className="text-gray-700">Identification of relevant legal principles and precedents</li>
                <li className="text-gray-700">Strategic recommendations based on similar case outcomes</li>
                <li className="text-gray-700">Risk assessment and argument formulation</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Limitations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-700">The tool relies on AI knowledge cutoff date and may not include the very latest legal developments</li>
                <li className="text-gray-700">All suggestions should be verified against current legal sources</li>
                <li className="text-gray-700">The analysis is meant to supplement, not replace, professional legal expertise</li>
              </ul>
            </div>
          </details>
        </div>
      </main>
      
      
    </div>
    </>
  );
}