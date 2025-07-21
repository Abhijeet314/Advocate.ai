"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { LearningCategory } from '../app/types/types';
import { generateLearningTrack } from '../app/api';
import { saveLearningTrack} from '../app/utils/storage';

export default function LearningTrack() {
  const router = useRouter();
  const [category, setCategory] = useState<LearningCategory>('For Fun');
  const [specificArea, setSpecificArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!specificArea.trim()) {
      setError('Please enter a specific area of interest');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const track = await generateLearningTrack(category, specificArea);
      saveLearningTrack(track);
      router.push(`/tracks/${track.track_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Law Learning Platform</title>
        <meta name="description" content="Personalized law learning tracks for students and professionals" />
      </Head>
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Law Learning Platform</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized learning tracks for any legal topic. Perfect for exam preparation, 
            deepening your knowledge, or exploring legal concepts just for fun.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create a Learning Track</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                Learning Goal
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value as LearningCategory)}
              >
                <option value="For Fun">For Fun</option>
                <option value="Exam Preparation">Exam Preparation</option>
                <option value="Deep Knowledge">Deep Knowledge</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {category === 'For Fun' && 'Casual exploration of legal topics in an engaging way'}
                {category === 'Exam Preparation' && 'Structured learning paths designed for exam success'}
                {category === 'Deep Knowledge' && 'Comprehensive tracks for mastering complex legal domains'}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="specificArea">
                Specific Area of Interest
              </label>
              <input
                id="specificArea"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g., Constitutional Law, Bar Exam, Contract Negotiation"
                value={specificArea}
                onChange={(e) => setSpecificArea(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 text-white font-medium rounded-md shadow-sm ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {isLoading ? 'Creating your learning track...' : 'Create Learning Track'}
            </button>
          </form>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">01</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tell us what you want to learn</h3>
              <p className="text-gray-600">
                Specify your learning goals and area of interest to generate a custom learning track.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">02</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Follow the guided modules</h3>
              <p className="text-gray-600">
                Work through curated resources, practice activities, and interactive quizzes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">03</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Track your progress</h3>
              <p className="text-gray-600">
                Earn tokens as you complete objectives and quizzes to measure your advancement.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


