import { QuizQuestion, UserAnswerValue, QuizAttemptResult } from '../types/quiz';

export interface SavedQuizState {
  version: number;
  screen: 'quiz' | 'results' | 'review';
  quizTitle: string;
  quizDescription: string;
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: Record<string, UserAnswerValue>;
  flaggedQuestionIds: string[];
  attemptResult: QuizAttemptResult | null;
  elapsedSeconds: number;
  savedAt: number;
}

const STORAGE_KEY = 'quiz_player_active_session_v1';

export function saveQuizStateToStorage(state: SavedQuizState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save quiz state to localStorage', err);
  }
}

export function loadQuizStateFromStorage(): SavedQuizState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return null;
    }
    return parsed as SavedQuizState;
  } catch (err) {
    console.warn('Failed to load quiz state from localStorage', err);
    return null;
  }
}

export function clearQuizStateFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear quiz state from localStorage', err);
  }
}
