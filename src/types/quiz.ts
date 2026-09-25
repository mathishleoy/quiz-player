export type QuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'fill_blank'
  | 'short_answer'
  | 'matching'
  | 'ordering'
  | 'classification'
  | 'scenario';

export interface BaseQuestion {
  id: string;
  originalIndex: number;
  type: QuestionType;
  text: string;
  feedback?: string;
  points?: number;
}

export interface MCQQuestionData extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correct: number;
}

export interface MultipleSelectQuestionData extends BaseQuestion {
  type: 'multiple_select';
  options: string[];
  correct: number[];
}

export interface FillBlankQuestionData extends BaseQuestion {
  type: 'fill_blank';
  correct: string[];
  caseSensitive?: boolean;
}

export interface ShortAnswerQuestionData extends BaseQuestion {
  type: 'short_answer';
  correct: string[];
  caseSensitive?: boolean;
  maxLength?: number;
}

export interface MatchingPair {
  prompt: string;
  answer: string;
}

export interface MatchingQuestionData extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
  distractors?: string[];
}

export interface OrderingQuestionData extends BaseQuestion {
  type: 'ordering';
  items: string[];
}

export interface ClassificationItem {
  text: string;
  category: string;
}

export interface ClassificationQuestionData extends BaseQuestion {
  type: 'classification';
  categories: string[];
  items: ClassificationItem[];
}

export interface ScenarioQuestionData extends BaseQuestion {
  type: 'scenario';
  scenario: string;
  options: string[];
  correct: number;
}

export type QuizQuestion =
  | MCQQuestionData
  | MultipleSelectQuestionData
  | FillBlankQuestionData
  | ShortAnswerQuestionData
  | MatchingQuestionData
  | OrderingQuestionData
  | ClassificationQuestionData
  | ScenarioQuestionData;

export interface RawQuizData {
  title: string;
  description?: string;
  questions: any[];
}

// User Answer Types
export type UserAnswerValue =
  | number // mcq, scenario
  | number[] // multiple_select
  | string[] // fill_blank (array of strings per blank)
  | string // short_answer
  | Record<string, string> // matching: prompt -> answer
  | string[] // ordering: list of items in user order
  | Record<string, string[]> // classification: category -> list of item texts
  | null
  | undefined;

export interface QuestionScoreResult {
  questionId: string;
  earned: number;
  possible: number;
  isCorrect: boolean;
  isPartial: boolean;
  isIncorrect: boolean;
  correctAnswerSummary: string;
  userAnswerSummary: string;
  feedback?: string;
}

export interface QuizAttemptResult {
  totalEarned: number;
  totalPossible: number;
  percentage: number;
  questionResults: Record<string, QuestionScoreResult>;
  completedAt: Date;
}
