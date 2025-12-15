
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  name: string;
  avatar: string;
  xp: number;
  level: number;
}

export interface Mission {
  id: number;
  title: string;
  level: Difficulty;
  location: string;
  emoji: string;
  vocab: string[]; // Array of 4-5 survival chunks
  story_brief: string; // New narrative field
  target_phrase: string;
  bgImage: string; // Keeping for visuals
  color: string; // Keeping for UI theming
  isDaily?: boolean; // Flag for special daily drops
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  userRole: boolean; // True if it's the user's turn to speak
}

export interface SessionState {
  currentScenarioId: number | null;
  step: number;
  score: number;
  isListening: boolean;
  feedbackStatus: 'idle' | 'listening' | 'analyzing' | 'success' | 'retry';
}
