import React, { useEffect } from 'react';
import { QuizQuestion, UserAnswerValue, QuizAttemptResult } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { QuizNavigation } from './QuizNavigation';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, RotateCcw } from 'lucide-react';

interface QuizPlayViewProps {
  quizTitle: string;
  quizDescription?: string;
  questions: QuizQuestion[];
  currentIndex: number;
  onIndexChange: (idx: number) => void;
  userAnswers: Record<string, UserAnswerValue>;
  onAnswerChange: (questionId: string, val: UserAnswerValue) => void;
  flaggedQuestions: Set<string>;
  onToggleFlag: (questionId: string) => void;
  onRequestSubmit: () => void;
  isReview?: boolean;
  attemptResult?: QuizAttemptResult;
  onFinishReview?: () => void;
  onRestartQuiz: () => void;
  elapsedSeconds?: number;
}

export const QuizPlayView: React.FC<QuizPlayViewProps> = ({
  quizTitle,
  quizDescription,
  questions,
  currentIndex,
  onIndexChange,
  userAnswers,
  onAnswerChange,
  flaggedQuestions,
  onToggleFlag,
  onRequestSubmit,
  isReview = false,
  attemptResult,
  onFinishReview,
  onRestartQuiz,
  elapsedSeconds = 0,
}) => {
  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  // Keyboard navigation when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowRight' || e.key === 'n') {
        if (!isLast) onIndexChange(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        if (!isFirst) onIndexChange(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFirst, isLast, onIndexChange]);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Review Mode Banner */}
      {isReview && (
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Review Mode: </span>
              <span className="text-slate-300">
                You are reviewing your attempt with official feedback and answers shown.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onFinishReview && (
              <button
                type="button"
                onClick={onFinishReview}
                className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-md font-semibold text-xs transition-colors"
              >
                Back to Results
              </button>
            )}
            <button
              type="button"
              onClick={onRestartQuiz}
              className="px-3.5 py-1.5 bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 rounded-md font-semibold text-xs transition-colors"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Question Content on Left, Navigation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Area */}
        <div className="lg:col-span-8 space-y-6">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            totalQuestions={questions.length}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(val) => onAnswerChange(currentQuestion.id, val)}
            isFlagged={flaggedQuestions.has(currentQuestion.id)}
            onToggleFlag={() => onToggleFlag(currentQuestion.id)}
            isReview={isReview}
            scoreResult={attemptResult?.questionResults[currentQuestion.id]}
          />

          {/* Bottom Step-by-Step Navigation Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onIndexChange(currentIndex - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous page</span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Question {currentIndex + 1} of {questions.length}
            </span>

            {isLast ? (
              !isReview ? (
                <button
                  type="button"
                  onClick={onRequestSubmit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onFinishReview}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  <span>Finish Review</span>
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => onIndexChange(currentIndex + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Next page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Moodle Navigation Block */}
        <div className="lg:col-span-4 sticky top-20">
          <QuizNavigation
            questions={questions}
            currentIndex={currentIndex}
            onSelectIndex={onIndexChange}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onSubmitQuiz={onRequestSubmit}
            isReview={isReview}
            attemptResult={attemptResult}
            elapsedSeconds={elapsedSeconds}
          />
        </div>
      </div>
    </div>
  );
};
