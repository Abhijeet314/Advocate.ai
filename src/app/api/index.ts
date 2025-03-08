import { LearningCategory, LearningTrack, Module, QuizQuestion } from "../types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learningtracklegal.onrender.com/api';
  
  export async function generateLearningTrack(category: LearningCategory, specificArea: string): Promise<LearningTrack> {
    const response = await fetch(`${API_BASE_URL}/generate_learning_track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, specific_area: specificArea }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate learning track');
    }
  
    return response.json();
  }
  
  export async function getQuizQuestions(module: Module, numQuestions: number = 5): Promise<QuizQuestion[]> {
    const response = await fetch(`${API_BASE_URL}/get_quiz_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ module, num_questions: numQuestions }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate quiz questions');
    }
  
    const data = await response.json();
    return data.questions;
  }
  
  export async function awardTokens(userId: string, amount: number): Promise<{ tokens_awarded: number }> {
    const response = await fetch(`${API_BASE_URL}/award_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, amount }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to award tokens');
    }
  
    return response.json();
  }
  
  export async function trackProgress(userId: string, trackId: string, moduleTitle: string, objectiveIndex: number, isCompleted: boolean = true): Promise<{ tokens_awarded?: number }> {
    const response = await fetch(`${API_BASE_URL}/track_progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        track_id: trackId,
        module_title: moduleTitle,
        objective_index: objectiveIndex,
        is_completed: isCompleted,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to track progress');
    }
  
    return response.json();
  }