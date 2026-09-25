import React from 'react';
import { MultipleSelectQuestionData, QuestionScoreResult } from '../../types/quiz';
import { Check, CheckCircle2, XCircle } from 'lucide-react';

interface MultipleSelectQuestionProps {
  question: MultipleSelectQuestionData;
  answer?: number[];
  onChange: (val: number[]) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Select one or more:
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selected.includes(idx);
          const isTargetCorrect = correctSet.has(idx);

          let cardStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-800';

          if (isReview) {
            if (isTargetCorrect && isSelected) {
              // Correctly chosen
              cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500';
            } else if (isTargetCorrect && !isSelected) {
              // Missed correct answer
              cardStyle = 'border-amber-400 bg-amber-50/60 text-amber-900 border-dashed';
            } else if (!isTargetCorrect && isSelected) {
              // Wrongly chosen
              cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400';
            } else {
              cardStyle = 'border-slate-200 bg-white opacity-50 text-slate-500';
            }
          } else if (isSelected) {
            cardStyle = 'border-slate-900 bg-slate-50 text-slate-900 ring-2 ring-slate-900 shadow-xs';
          }

          return (
            <label
              key={idx}
              className={`flex items-start gap-3.5 p-3.5 rounded-lg border text-sm transition-all cursor-pointer ${cardStyle} ${
                isReview ? 'cursor-default pointer-events-none' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleOption(idx);
              }}
            >
              {/* Checkbox box */}
              <div
                className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 border transition-colors ${
                  isSelected
                    ? isReview && !isTargetCorrect
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : isReview && isTargetCorrect
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-black border-black text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Letter identifier */}
              <span className="text-xs font-bold text-slate-500 uppercase mt-0.5 shrink-0">
                {OPTION_LABELS[idx]}.
              </span>

              <div className="flex-1 leading-relaxed font-normal">
                {opt}
              </div>

              {/* Review status hints */}
              {isReview && isTargetCorrect && isSelected && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Correct</span>
                </div>
              )}
              {isReview && isTargetCorrect && !isSelected && (
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 shrink-0">
                  <span className="hidden sm:inline">Missed answer</span>
                </div>
              )}
              {isReview && !isTargetCorrect && isSelected && (
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-700 shrink-0">
                  <XCircle className="w-4 h-4 text-rose-600" />
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
