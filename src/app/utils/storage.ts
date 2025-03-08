import { LearningTrack, UserProgress } from "../types/types";

const USER_ID_KEY = 'law_learning_user_id';
  const TRACKS_KEY = 'law_learning_tracks';
  const PROGRESS_KEY = 'law_learning_progress';
  
  export function getUserId(): string {
    if (typeof window === 'undefined') return '';
    
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  }
  
  export function saveLearningTrack(track: LearningTrack): void {
    if (typeof window === 'undefined') return;
    
    const existingTracks = JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]');
    const trackIndex = existingTracks.findIndex((t: LearningTrack) => t.track_id === track.track_id);
    
    if (trackIndex >= 0) {
      existingTracks[trackIndex] = track;
    } else {
      existingTracks.push(track);
    }
    
    localStorage.setItem(TRACKS_KEY, JSON.stringify(existingTracks));
  }
  
  export function getLearningTracks(): LearningTrack[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(TRACKS_KEY) || '[]');
  }
  
  export function getLearningTrack(trackId: string): LearningTrack | null {
    const tracks = getLearningTracks();
    return tracks.find(track => track.track_id === trackId) || null;
  }
  
  export function saveUserProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(`${PROGRESS_KEY}_${progress.user_id}_${progress.track_id}`, JSON.stringify(progress));
  }
  
  export function getUserProgress(userId: string, trackId: string): UserProgress | null {
    if (typeof window === 'undefined') return null;
    
    const progressData = localStorage.getItem(`${PROGRESS_KEY}_${userId}_${trackId}`);
    if (!progressData) return null;
    
    return JSON.parse(progressData);
  }
  
  export function getTokensEarned(userId: string): number {
    if (typeof window === 'undefined') return 0;
    
    const trackIds = getLearningTracks().map(track => track.track_id);
    let totalTokens = 0;
    
    trackIds.forEach(trackId => {
      const progress = getUserProgress(userId, trackId);
      if (progress) {
        totalTokens += progress.tokens_earned;
      }
    });
    
    return totalTokens;
  }
  