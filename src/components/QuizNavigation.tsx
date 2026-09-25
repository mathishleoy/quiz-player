import React from 'react';
import { QuizQuestion, UserAnswerValue, QuizAttemptResult } from '../types/quiz';
import { isQuestionAnswered } from '../utils/scoring';
import { Flag, Send, Clock } from 'lucide-react';

interface QuizNavigationProps {
  questions: QuizQuestion[];
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  userAnswers: Record<string, UserAnswerValue>;
  flaggedQuestions: Set<string>;
  onSubmitQuiz: () => void;
  isReview?: boolean;
  attemptResult?: QuizAttemptResult;
  elapsedSeconds?: number;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  questions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  flaggedQuestions,
  onSubmitQuiz,
  isReview = false,
  attemptResult,
  elapsedSeconds = 0,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <h3 className="font-bold text-sm text-slate-800 tracking-tight">Quiz navigation</h3>
        {elapsedSeconds > 0 && (
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {/* Grid of Numbered Pills */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = isQuestionAnswered(q, userAnswers[q.id]);
          const isFlagged = flaggedQuestions.has(q.id);

          let pillColor = 'border-slate-300 bg-white text-slate-700 hover:border-slate-500';

          if (isReview && attemptResult) {
            const res = attemptResult.questionResults[q.id];
            if (res?.isCorrect) {
              pillColor = 'border-emerald-500 bg-emerald-600 text-white';
            } else if (res?.isPartial) {
              pillColor = 'border-amber-500 bg-amber-500 text-white';
            } else {
              pillColor = 'border-rose-500 bg-rose-600 text-white';
            }
          } else if (isAnswered) {
            pillColor = 'border-slate-600 bg-slate-200 text-slate-900 font-semibold';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-md border flex flex-col items-center justify-center text-xs font-medium transition-all ${pillColor} ${
                isCurrent
                  ? 'ring-2 ring-black ring-offset-1 font-bold shadow-xs'
                  : ''
              }`}
              title={`Question ${idx + 1}: ${
                isReview
                  ? attemptResult?.questionResults[q.id]?.isCorrect
                    ? 'Correct'
                    : 'Incorrect'
                  : isAnswered
                  ? 'Answer saved'
                  : 'Not answered'
              }`}
            >
              <span>{idx + 1}</span>

              {/* Moodle style answered indicator underline/half */}
              {!isReview && isAnswered && (
                <span className="w-4 h-1 bg-slate-700 rounded-full mt-0.5" />
              )}

              {/* Flagged Red Triangle in Top-Right Corner */}
              {isFlagged && (
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full flex items-center justify-center shadow-xs"
                  title="Flagged for review"
                >
                  <span className="sr-only">Flagged</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend / Status Key */}
      <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-1.5">
        {isReview ? (
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Correct
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Incorrect
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-slate-300 bg-slate-200 rounded-xs inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-slate-300 bg-white rounded-xs inline-block" /> Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" /> Flagged
            </span>
          </div>
        )}
      </div>

      {/* Submit Action (Moodle "Finish attempt...") */}
      {!isReview && (
        <div className="border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={onSubmitQuiz}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-black hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish attempt...</span>
          </button>
        </div>
      )}
    </div>
  );
};
