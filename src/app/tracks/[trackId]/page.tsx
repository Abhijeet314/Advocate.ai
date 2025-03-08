"use client"
import React, { useState, useEffect } from 'react';
  import { useRouter, useParams } from 'next/navigation';
  
  import Head from 'next/head';
  import Link from 'next/link';
  import { 
    getLearningTrack, 
    getUserId, 
    getUserProgress, 
    saveUserProgress 
  } from '../../utils/storage';
  import { trackProgress } from '../../api';
  import { LearningTrack, Module, UserProgress } from '../../../app/types/types';
  
  export default function TrackDetail() {
    const router = useRouter();
    const params = useParams();
    const trackId = params?.trackId;
    
    const [track, setTrack] = useState<LearningTrack | null>(null);
    const [userId, setUserId] = useState('');
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
      if (typeof trackId !== 'string') return;
      
      const id = getUserId();
      setUserId(id);
      
      const trackData = getLearningTrack(trackId);
      if (!trackData) {
        setError('Learning track not found');
        setIsLoading(false);
        return;
      }
      
      setTrack(trackData);
      
      const userProgress = getUserProgress(id, trackId);
      if (userProgress) {
        setProgress(userProgress);
        
        // Find first module with incomplete objectives
        const moduleIndex = trackData.modules.findIndex((module) => {
          const completedObjectives = userProgress.completed_objectives[module.title] || [];
          return completedObjectives.length < module.learning_objectives.length;
        });
        
        if (moduleIndex >= 0) {
          setCurrentModuleIndex(moduleIndex);
        }
      } else {
        // Initialize new progress object
        const newProgress: UserProgress = {
          user_id: id,
          track_id: trackId,
          completed_objectives: {},
          quiz_results: {},
          tokens_earned: 0,
          last_updated: new Date().toISOString()
        };
        setProgress(newProgress);
        saveUserProgress(newProgress);
      }
      
      setIsLoading(false);
    }, [trackId]);
    
    const handleObjectiveCompletion = async (moduleTitle: string, objectiveIndex: number) => {
      if (!progress || !track || !userId) return;
      
      try {
        // Update local state
        const newProgress = { ...progress };
        
        if (!newProgress.completed_objectives[moduleTitle]) {
          newProgress.completed_objectives[moduleTitle] = [];
        }
        
        if (!newProgress.completed_objectives[moduleTitle].includes(objectiveIndex)) {
          newProgress.completed_objectives[moduleTitle].push(objectiveIndex);
          
          // Update backend
          const result = await trackProgress(userId, track.track_id, moduleTitle, objectiveIndex);
          
          // Update tokens if awarded
          if (result.tokens_awarded) {
            newProgress.tokens_earned += result.tokens_awarded;
          }
          
          newProgress.last_updated = new Date().toISOString();
          setProgress(newProgress);
          saveUserProgress(newProgress);
        }
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    };
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    
    if (error || !track) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'An error occurred'}</h1>
          <Link href="/tracks" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Tracks
            
          </Link>
        </div>
      );
    }
    
    const currentModule = track.modules[currentModuleIndex];
    const totalObjectives = track.modules.reduce((sum, module) => sum + module.learning_objectives.length, 0);
    const completedObjectives = Object.values(progress?.completed_objectives || {}).flat().length;
    const progressPercentage = Math.round((completedObjectives / totalObjectives) * 100);
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>{track.track_title} | Law Learning Platform</title>
        </Head>
        
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <Link href="/tracks" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                  ← Back to All Tracks
                
              </Link>
              <h1 className="text-3xl font-bold text-indigo-900">{track.track_title}</h1>
            </div>
            <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-md shadow-sm">
              <span className="text-sm text-gray-500">Overall Progress</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
              </div>
            </div>
          </div>
          
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Module navigation sidebar */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Modules</h2>
              <ul className="space-y-1">
                {track.modules.map((module, index) => {
                  const moduleObjectives = module.learning_objectives.length;
                  const completedModuleObjectives = (progress?.completed_objectives[module.title] || []).length;
                  const moduleProgress = Math.round((completedModuleObjectives / moduleObjectives) * 100);
                  
                  return (
                    <li key={index}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          index === currentModuleIndex 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentModuleIndex(index)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">{module.title}</span>
                          <span className="text-xs text-gray-500">{moduleProgress}%</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            </div>
            
            {/* Current module content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentModule.title}</h2>
                <p className="text-gray-600 mb-6">{currentModule.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {currentModule.learning_objectives.map((objective, index) => {
                      const isCompleted = progress?.completed_objectives[currentModule.title]?.includes(index) || false;
                      
                      return (
                        <li key={index} className="flex items-start">
                          <button
                            className={`flex-shrink-0 w-5 h-5 rounded border mr-3 mt-0.5 ${
                              isCompleted 
                                ? 'bg-indigo-600 border-indigo-600' 
                                : 'border-gray-300 hover:border-indigo-500'
                            }`}
                            onClick={() => handleObjectiveCompletion(currentModule.title, index)}
                            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {isCompleted && (
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className={isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {objective}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentModule.key_concepts.map((concept, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Resources */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Resources</h3>
                <div className="space-y-4">
                  {currentModule.resources.map((resource, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4 py-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                        <span className="text-sm text-gray-500">{resource.time_estimate}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded mr-3 ${
                          resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
                          resource.type === 'video' ? 'bg-red-100 text-red-800' :
                          resource.type === 'blog' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {resource.type.toUpperCase()}
                        </span>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View Resource →
                        </a>
                      </div>
                      {resource.content_summary && (
                        <p className="text-gray-500 text-xs mt-2 italic">
                          {resource.content_summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Practice Activities */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Practice Activities</h3>
                <ul className="space-y-3">
                {currentModule.practice_activities.map((activity, index) => (
                    <li key={index} className="text-gray-700">
                        <div className="flex items-start">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full mr-3 text-sm font-medium">
                            {index + 1}
                        </span>
                        <span>{activity}</span>
                        </div>
                    </li>
                ))}
                </ul>
            </div>
            {/* Quiz Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Module Quiz</h3>
            <p className="text-gray-600 mb-4">
                Test your understanding of the key concepts in this module.
            </p>
            <Link href={`/quiz/${track.track_id}/${currentModuleIndex}`} className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                
                Start Quiz
                
            </Link>
            </div>
            </div>
            </main>
            </div>
    );
  }