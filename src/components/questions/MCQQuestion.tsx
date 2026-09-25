import React from 'react';
import { MCQQuestionData, QuestionScoreResult } from '../../types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';

interface MCQQuestionProps {
  question: MCQQuestionData;
  answer?: number;
  onChange: (val: number) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Select one:
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          const isUserWrong = isSelected && !isCorrect && isReview;

          let cardStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-800';

          if (isReview) {
            if (isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500';
            } else if (isUserWrong) {
              cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400';
            } else {
              cardStyle = 'border-slate-200 bg-white opacity-60 text-slate-600';
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
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 uppercase transition-colors ${
                  isSelected && !isReview
                    ? 'bg-black text-white'
                    : isReview && isCorrect
                    ? 'bg-emerald-600 text-white'
                    : isReview && isUserWrong
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {OPTION_LABELS[idx] || idx + 1}
              </div>

              <div className="flex-1 pt-0.5 leading-relaxed font-normal">
                {opt}
              </div>

              {/* Review status icons */}
              {isReview && isCorrect && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Correct</span>
                </div>
              )}
              {isReview && isUserWrong && (
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-700 shrink-0">
                  <XCircle className="w-4 h-4 text-rose-600" />
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
