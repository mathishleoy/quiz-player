import React from 'react';
import { FillBlankQuestionData, QuestionScoreResult } from '../../types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillBlankQuestionProps {
  question: FillBlankQuestionData;
  answer?: string[];
  onChange: (val: string[]) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  answer,
  onChange,
  isReview = false,
  scoreResult,
}) => {
  // Count blanks in prompt
  const segments = question.text.split(/_{2,}/g);
  const blankCount = Math.max(1, segments.length > 1 ? segments.length - 1 : question.correct.length);

  const currentValues = Array.isArray(answer)
    ? [...answer]
    : Array(blankCount).fill('');

  while (currentValues.length < blankCount) {
    currentValues.push('');
  }

  const handleInputChange = (index: number, val: string) => {
    if (isReview) return;
    const next = [...currentValues];
    next[index] = val;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        Fill in the missing word(s):
      </div>

      {/* Inline interactive prompt if segmented */}
      {segments.length > 1 ? (
        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 leading-loose text-base font-normal">
          {segments.map((segment, idx) => {
            const hasInputAfter = idx < blankCount;
            const userVal = currentValues[idx] || '';
            const correctVal = question.correct[idx] || '';
            
            const isMatch = question.caseSensitive
              ? userVal.trim() === correctVal.trim()
              : userVal.trim().toLowerCase() === correctVal.trim().toLowerCase();

            return (
              <React.Fragment key={idx}>
                <span>{segment}</span>
                {hasInputAfter && (
                  <span className="inline-block mx-1.5 align-middle">
                    <input
                      type="text"
                      disabled={isReview}
                      value={userVal}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      placeholder={`[blank ${idx + 1}]`}
                      className={`px-3 py-1 font-mono text-sm rounded-md border transition-all text-center min-w-[120px] max-w-[200px] ${
                        isReview
                          ? isMatch
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200 line-through'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white shadow-2xs'
                      }`}
                    />
                    {isReview && !isMatch && (
                      <span className="ml-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {correctVal}
                      </span>
                    )}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* If no ____ placeholder was found in text, render inputs below */
        <div className="space-y-3">
          <p className="text-slate-800 dark:text-slate-200 text-base">{question.text}</p>
          <div className="space-y-2 pt-2">
            {question.correct.map((correctVal, idx) => {
              const userVal = currentValues[idx] || '';
              const isMatch = question.caseSensitive
                ? userVal.trim() === correctVal.trim()
                : userVal.trim().toLowerCase() === correctVal.trim().toLowerCase();

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-16">
                    Blank #{idx + 1}:
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      disabled={isReview}
                      value={userVal}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      placeholder="Type your answer here..."
                      className={`w-full px-3.5 py-2 font-mono text-sm rounded-md border transition-all ${
                        isReview
                          ? isMatch
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white shadow-2xs'
                      }`}
                    />
                  </div>
                  {isReview && (
                    <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                      {isMatch ? (
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-rose-600" /> Expected: <strong>{correctVal}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {question.caseSensitive && (
        <div className="text-[11px] text-slate-500 italic">
          * Note: This question is case-sensitive.
        </div>
      )}
    </div>
  );
};
