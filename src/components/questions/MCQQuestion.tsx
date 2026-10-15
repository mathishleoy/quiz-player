import React from 'react';
import { MCQQuestionData, QuestionScoreResult } from '../../types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FormattedText } from '../FormattedText';

interface MCQQuestionProps {
  question: MCQQuestionData;
  answer?: number;
  onChange: (val: number) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  answer,
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const selected = typeof answer === 'number' ? answer : -1;

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        Select one:
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          const isUserWrong = isSelected && !isCorrect && isReview;

          let cardStyle =
            'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/70 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 shadow-2xs';

          if (isReview) {
            if (isCorrect) {
              cardStyle =
                'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500';
            } else if (isUserWrong) {
              cardStyle =
                'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400';
            } else {
              cardStyle =
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 opacity-60 text-slate-600 dark:text-slate-400';
            }
          } else if (isSelected) {
            cardStyle =
              'border-slate-900 dark:border-slate-100 bg-slate-100/90 dark:bg-slate-800/90 text-slate-950 dark:text-white ring-2 ring-slate-900 dark:ring-slate-100 shadow-xs';
          }

          return (
            <label
              key={idx}
              className={`group flex items-start sm:items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-sm transition-all cursor-pointer ${cardStyle} ${
                isReview ? 'cursor-default pointer-events-none' : ''
              }`}
            >
              <input
                type="radio"
                name={`mcq_${question.id}`}
                value={idx}
                checked={isSelected}
                disabled={isReview}
                onChange={() => !isReview && onChange(idx)}
                className="sr-only"
              />

              {/* Moodle letter identifier badge */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 uppercase transition-all shadow-2xs ${
                  isSelected && !isReview
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 scale-105'
                    : isReview && isCorrect
                    ? 'bg-emerald-600 text-white'
                    : isReview && isUserWrong
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                }`}
              >
                {OPTION_LABELS[idx] || idx + 1}
              </div>

              {/* Answer Content with Rich Formatting & Monospace Subnets */}
              <div className="flex-1 text-sm sm:text-base leading-relaxed font-normal">
                <FormattedText text={opt} />
              </div>

              {/* Radio selection circle indicator */}
              {!isReview && (
                <div className="shrink-0 pl-1 self-center">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white'
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white dark:bg-slate-950" />
                    )}
                  </div>
                </div>
              )}

              {/* Review status icons */}
              {isReview && isCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Correct</span>
                </div>
              )}
              {isReview && isUserWrong && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 shrink-0">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="hidden sm:inline">Your choice</span>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

