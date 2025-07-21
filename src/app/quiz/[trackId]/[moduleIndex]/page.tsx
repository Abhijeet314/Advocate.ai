// File: pages/quiz/[trackId]/[moduleIndex].tsx - Quiz page
"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { 
  getLearningTrack, 
  getUserId, 
  getUserProgress, 
  saveUserProgress 
} from '../../../utils/storage';
import { getQuizQuestions, awardTokens } from '../../../api';
import { LearningTrack, Module, QuizQuestion, UserProgress } from '../../../../app/types/types';

export default function Quiz() {
  const params = useParams();
  const trackId = params?.trackId;
  const moduleIndex = params?.moduleIndex;
  
  const [track, setTrack] = useState<LearningTrack | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState('');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokensAwarded, setTokensAwarded] = useState(0);
  
  useEffect(() => {
    if (typeof trackId !== 'string' || typeof moduleIndex !== 'string') return;
    
    const moduleIdx = parseInt(moduleIndex);
    if (isNaN(moduleIdx)) {
      setError('Invalid module index');
      setIsLoading(false);
      return;
    }
    
    const id = getUserId();
    setUserId(id);
    
    const trackData = getLearningTrack(trackId);
    if (!trackData) {
      setError('Learning track not found');
      setIsLoading(false);
      return;
    }
    
    setTrack(trackData);
    
    if (moduleIdx < 0 || moduleIdx >= trackData.modules.length) {
      setError('Module not found');
      setIsLoading(false);
      return;
    }
    
    const moduleData = trackData.modules[moduleIdx];
    setModule(moduleData);
    
    const userProgress = getUserProgress(id, trackId);
    if (userProgress) {
      setProgress(userProgress);
    }
    
    // Load quiz questions
    const loadQuestions = async () => {
      try {
        // Check if we have quiz questions in the module already
        if (moduleData.quiz_questions && moduleData.quiz_questions.length > 0) {
          setQuestions(moduleData.quiz_questions);
        } else {
          // Otherwise fetch from API
          const fetchedQuestions = await getQuizQuestions(moduleData);
          setQuestions(fetchedQuestions);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz questions');
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [trackId, moduleIndex]);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer_index;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setIsAnswered(true);
    
    // Save quiz results in progress
    if (progress && track && module) {
      const newProgress = { ...progress };
      
      if (!newProgress.quiz_results[module.title]) {
        newProgress.quiz_results[module.title] = {};
      }
      
      newProgress.quiz_results[module.title][currentQuestionIndex] = isCorrect;
      newProgress.last_updated = new Date().toISOString();
      
      setProgress(newProgress);
      saveUserProgress(newProgress);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      completeQuiz();
    }
  };
  
  const completeQuiz = async () => {
    if (!track || !module || !userId) return;
    
    setIsCompleted(true);
    
    // Calculate score percentage
    const scorePercentage = Math.round((score / questions.length) * 100);
    
    // Award tokens based on score
    let tokensToAward = 0;
    if (scorePercentage >= 90) {
      tokensToAward = 20;
    } else if (scorePercentage >= 70) {
      tokensToAward = 10;
    } else if (scorePercentage >= 50) {
      tokensToAward = 5;
    }
    
    try {
      if (tokensToAward > 0) {
        const result = await awardTokens(userId, tokensToAward);
        setTokensAwarded(result.tokens_awarded);
        
        // Update local progress
        if (progress) {
          const newProgress = { ...progress };
          newProgress.tokens_earned += result.tokens_awarded;
          newProgress.last_updated = new Date().toISOString();
          setProgress(newProgress);
          saveUserProgress(newProgress);
        }
      }
    } catch (err) {
      console.error('Failed to award tokens:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !track || !module || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Failed to load quiz'}</h1>
        <Link href={`/tracks/${trackId}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Back to Track
        </Link>
      </div>
    );
  }
  
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Quiz Results | {module.title}</title>
        </Head>
        
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Completed!</h1>
            
            <div className="mb-8">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Score</h2>
              <p className="text-4xl font-bold text-indigo-600 mb-1">
                {score} / {questions.length}
              </p>
              <p className="text-gray-600">
                {Math.round((score / questions.length) * 100)}% Correct
              </p>
            </div>
            
            {tokensAwarded > 0 && (
              <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  Congratulations!
                </h3>
                <p className="text-yellow-700">
                  You earned <span className="font-bold">{tokensAwarded} tokens</span> for completing this quiz.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={`/tracks/${trackId}`} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Return to Track
                
              </Link>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setScore(0);
                  setIsCompleted(false);
                }}
                className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Quiz | {module.title}</title>
      </Head>
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href={`/tracks/${trackId}`} className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
            ← Back to Track
          
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{module.title} Quiz</h1>
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 border rounded-md transition-colors ${
                    selectedOption === index 
                      ? isAnswered 
                        ? index === currentQuestion.correct_answer_index
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-indigo-500 bg-indigo-50'
                      : isAnswered && index === currentQuestion.correct_answer_index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      selectedOption === index 
                        ? isAnswered 
                          ? index === currentQuestion.correct_answer_index
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-indigo-500 text-white'
                        : isAnswered && index === currentQuestion.correct_answer_index
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-400 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`${
                      isAnswered && (
                        index === currentQuestion.correct_answer_index
                          ? 'text-green-800 font-medium'
                          : selectedOption === index ? 'text-red-800' : ''
                      )
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {isAnswered && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Explanation</h3>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                className={`px-6 py-3 rounded-md ${
                  selectedOption !== null
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}