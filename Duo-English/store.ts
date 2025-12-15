import { create } from 'zustand';
import { SessionState, User } from './types';

interface AppState extends SessionState {
  user: User | null;
  isLoggingIn: boolean;
  
  // Auth Actions
  login: () => void;
  logout: () => void;
  
  // Gamification Actions
  addXP: (amount: number) => void;

  // Session Actions
  setScenario: (id: number | null) => void;
  startListening: () => void;
  stopListening: () => void;
  setFeedbackStatus: (status: SessionState['feedbackStatus']) => void;
  advanceStep: () => void;
  resetSession: () => void;
}

const XP_PER_LEVEL = 100;

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isLoggingIn: false,

  currentScenarioId: null,
  step: 0,
  score: 0,
  isListening: false,
  feedbackStatus: 'idle',

  login: () => {
    set({ isLoggingIn: true });
    // Simulate API delay
    setTimeout(() => {
        set({
            isLoggingIn: false,
            user: {
                name: "Agent Smith",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
                xp: 1250,
                level: 13
            }
        });
    }, 1000);
  },

  logout: () => set({ user: null }),

  addXP: (amount) => set((state) => {
    if (!state.user) return {};

    const newXP = state.user.xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

    // Optional: We could trigger a "Level Up" toast state here if we wanted globally
    return {
        user: {
            ...state.user,
            xp: newXP,
            level: newLevel
        }
    };
  }),

  setScenario: (id) => set({ currentScenarioId: id, step: 0, score: 0, feedbackStatus: 'idle' }),
  
  startListening: () => set({ isListening: true, feedbackStatus: 'listening' }),
  
  stopListening: () => set({ isListening: false, feedbackStatus: 'analyzing' }),
  
  setFeedbackStatus: (status) => set({ feedbackStatus: status }),
  
  advanceStep: () => set((state) => ({ 
    step: state.step + 1, 
    score: state.score + 10,
    feedbackStatus: 'idle'
  })),

  resetSession: () => set({ currentScenarioId: null, step: 0, score: 0, isListening: false, feedbackStatus: 'idle' })
}));