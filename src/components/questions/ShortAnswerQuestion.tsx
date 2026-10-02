import React from 'react';
import { ShortAnswerQuestionData, QuestionScoreResult } from '../../types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionData;
  answer?: string;
  onChange: (val: string) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  answer = '',
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const maxLength = question.maxLength || 100;
  const currentText = typeof answer === 'string' ? answer : '';

  const isCorrect = scoreResult?.isCorrect ?? false;

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        Enter short answer:
      </div>

      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            disabled={isReview}
            maxLength={maxLength}
            value={currentText}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your response here..."
            className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all font-mono ${
              isReview
                ? isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white shadow-2xs'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {question.caseSensitive
              ? 'Case-sensitive grading enabled.'
              : 'Case-insensitive (capitalization does not matter).'}
          </span>
          {!isReview && (
            <span>
              {currentText.length} / {maxLength} chars
            </span>
          )}
        </div>
      </div>

      {isReview && (
        <div className="p-3 rounded-lg border text-xs space-y-1.5 bg-slate-50 border-slate-200">
          <div className="font-semibold text-slate-700">Accepted Answers:</div>
          <div className="flex flex-wrap gap-1.5">
            {question.correct.map((ans, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
              >
                {ans}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
