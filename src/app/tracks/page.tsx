"use client"
 import React from 'react';
  import Link from 'next/link';
  import Head from 'next/head';
  import { getLearningTracks, getUserId, getTokensEarned } from '../utils/storage';
  import { LearningTrack } from '../../app/types/types';
  
  export default function Tracks() {
    const [tracks, setTracks] = React.useState<LearningTrack[]>([]);
    const [tokensEarned, setTokensEarned] = React.useState(0);
    
    React.useEffect(() => {
      const userId = getUserId();
      setTracks(getLearningTracks());
      setTokensEarned(getTokensEarned(userId));
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>My Learning Tracks | Law Learning Platform</title>
        </Head>
        
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900">My Learning Tracks</h1>
            <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Create New Track
              
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Tokens Earned</h2>
                <p className="text-2xl font-semibold text-gray-900">{tokensEarned}</p>
              </div>
            </div>
          </div>
          
          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-700 mb-2">No Learning Tracks Yet</h2>
              <p className="text-gray-500 mb-6">Create your first learning track to get started</p>
              <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block">
                  Create First Track
                
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracks.map((track) => (
                <Link key={track.track_id} href={`/tracks/${track.track_id}`}  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{track.track_title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{track.track_description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        {track.modules.length} Modules • {track.time_commitment}
                      </span>
                      <span className="text-indigo-600">View Track →</span>
                    </div>
                  
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }