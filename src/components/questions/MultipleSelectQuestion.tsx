import React from 'react';
import { MultipleSelectQuestionData, QuestionScoreResult } from '../../types/quiz';
import { Check, CheckCircle2, XCircle } from 'lucide-react';
import { FormattedText } from '../FormattedText';

interface MultipleSelectQuestionProps {
  question: MultipleSelectQuestionData;
  answer?: number[];
  onChange: (val: number[]) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const MultipleSelectQuestion: React.FC<MultipleSelectQuestionProps> = ({
  question,
  answer = [],
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const selected = Array.isArray(answer) ? answer : [];
  const correctSet = new Set(question.correct);

  const toggleOption = (idx: number) => {
    if (isReview) return;
    if (selected.includes(idx)) {
      onChange(selected.filter(i => i !== idx));
    } else {
      onChange([...selected, idx].sort((a, b) => a - b));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        Select one or more:
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selected.includes(idx);
          const isTargetCorrect = correctSet.has(idx);

          let cardStyle =
            'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/70 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 shadow-2xs';

          if (isReview) {
            if (isTargetCorrect && isSelected) {
              // Correctly chosen
              cardStyle =
                'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500';
            } else if (isTargetCorrect && !isSelected) {
              // Missed correct answer
              cardStyle =
                'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-dashed';
            } else if (!isTargetCorrect && isSelected) {
              // Wrongly chosen
              cardStyle =
                'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400';
            } else {
              cardStyle =
                'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 opacity-50 text-slate-500 dark:text-slate-400';
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
              onClick={(e) => {
                e.preventDefault();
                toggleOption(idx);
              }}
            >
              {/* Checkbox box indicator */}
              <div
                className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 border-2 transition-colors ${
                  isSelected
                    ? isReview && !isTargetCorrect
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : isReview && isTargetCorrect
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Letter identifier badge */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold uppercase shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-extrabold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {OPTION_LABELS[idx]}
              </div>

              {/* Answer Content with FormattedText */}
              <div className="flex-1 text-sm sm:text-base leading-relaxed font-normal">
                <FormattedText text={opt} />
              </div>

              {/* Review status hints */}
              {isReview && isTargetCorrect && isSelected && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Correct</span>
                </div>
              )}
              {isReview && isTargetCorrect && !isSelected && (
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                  <span className="hidden sm:inline">Missed answer</span>
                </div>
              )}
              {isReview && !isTargetCorrect && isSelected && (
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 shrink-0">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="hidden sm:inline">Incorrect</span>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

