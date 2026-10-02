import React from 'react';
import { ScenarioQuestionData, QuestionScoreResult } from '../../types/quiz';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';

interface ScenarioQuestionProps {
  question: ScenarioQuestionData;
  answer?: number;
  onChange: (val: number) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e', 'f'];

export const ScenarioQuestion: React.FC<ScenarioQuestionProps> = ({
  question,
  answer,
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const selected = typeof answer === 'number' ? answer : -1;

  return (
    <div className="space-y-5">
      {/* Scenario Context Card */}
      <div className="p-4 sm:p-5 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-slate-300" />
          <span>Case Scenario & Context</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line font-normal">
          {question.scenario}
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Based on the scenario above, select the most appropriate option:
        </div>

        <div className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === question.correct;
            const isUserWrong = isSelected && !isCorrect && isReview;

            let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

            if (isReview) {
              if (isCorrect) {
                cardStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isUserWrong) {
                cardStyle = 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400';
              } else {
                cardStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60 text-slate-600 dark:text-slate-400';
              }
            } else if (isSelected) {
              cardStyle = 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-900 dark:ring-white shadow-xs';
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
                  name={`scenario_${question.id}`}
                  value={idx}
                  checked={isSelected}
                  disabled={isReview}
                  onChange={() => !isReview && onChange(idx)}
                  className="sr-only"
                />

                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 uppercase transition-colors ${
                    isSelected && !isReview
                      ? 'bg-black dark:bg-white text-white dark:text-slate-950'
                      : isReview && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isReview && isUserWrong
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {OPTION_LABELS[idx] || idx + 1}
                </div>

                <div className="flex-1 pt-0.5 leading-relaxed font-normal">
                  {opt}
                </div>

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
    </div>
  );
};
