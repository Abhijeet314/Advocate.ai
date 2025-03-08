export interface Resource {
    title: string;
    description: string;
    url: string;
    type: 'article' | 'video' | 'blog' | 'book';
    time_estimate: string;
    content_summary?: string;
  }
  
  export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer_index: number;
    explanation: string;
  }
  
  export interface Module {
    title: string;
    description: string;
    learning_objectives: string[];
    key_concepts: string[];
    resources: Resource[];
    practice_activities: string[];
    quiz_questions: QuizQuestion[];
  }
  
  export interface LearningTrack {
    track_id: string;
    track_title: string;
    track_description: string;
    target_audience: string;
    prerequisites: string[];
    time_commitment: string;
    modules: Module[];
  }
  
  export interface UserProgress {
    user_id: string;
    track_id: string;
    completed_objectives: Record<string, number[]>;
    quiz_results: Record<string, Record<number, boolean>>;
    tokens_earned: number;
    last_updated: string;
  }
  
  export type LearningCategory = 'For Fun' | 'Exam Preparation' | 'Deep Knowledge';