import React, { useMemo, useState } from 'react';
import { MatchingQuestionData, QuestionScoreResult } from '../../types/quiz';
import { shuffleArray } from '../../utils/quizValidator';
import { CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';

interface MatchingQuestionProps {
  question: MatchingQuestionData;
  answer?: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  answer = {},
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const currentMatches: Record<string, string> =
    typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {};

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Collect all available answer options (answers + distractors) and shuffle once per question
  const allAnswerOptions = useMemo(() => {
    const list = question.pairs.map(p => p.answer);
    if (question.distractors && question.distractors.length > 0) {
      list.push(...question.distractors);
    }
    return shuffleArray(Array.from(new Set(list)));
  }, [question.id]);

  const handlePair = (prompt: string, chosenAnswer: string) => {
    if (isReview) return;
    const next = { ...currentMatches };
    if (!chosenAnswer) {
      delete next[prompt];
    } else {
      next[prompt] = chosenAnswer;
    }
    onChange(next);
    setSelectedPrompt(null);
  };

  const handleUnpair = (prompt: string) => {
    if (isReview) return;
    const next = { ...currentMatches };
    delete next[prompt];
    onChange(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Match each item with its corresponding answer:
        </div>
        {!isReview && (
          <span className="text-xs text-slate-500 italic hidden sm:inline">
            Select via dropdown or click prompt then answer
          </span>
        )}
      </div>

      {/* Moodle Classic Matching Matrix */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 transition-colors">
        {question.pairs.map((pair, idx) => {
          const matchedVal = currentMatches[pair.prompt] || '';
          const isSelected = selectedPrompt === pair.prompt;
          const isCorrect = matchedVal === pair.answer;

          return (
            <div
              key={idx}
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isSelected
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : idx % 2 === 0
                  ? 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              {/* Prompt Item */}
              <div className="flex items-center gap-2.5 sm:w-1/2">
                <button
                  type="button"
                  disabled={isReview}
                  onClick={() => !isReview && setSelectedPrompt(isSelected ? null : pair.prompt)}
                  className={`px-3 py-1.5 rounded text-left text-sm font-medium transition-all flex items-center justify-between gap-2 w-full border ${
                    isSelected
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="leading-snug">{pair.prompt}</span>
                  {!isReview && (
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white dark:text-slate-950' : 'text-slate-400'}`} />
                  )}
                </button>
              </div>

              {/* Match Selector / Display (Moodle style dropdown) */}
              <div className="flex items-center gap-2 sm:w-1/2 justify-end">
                {isReview ? (
                  <div className="w-full flex items-center justify-between gap-2 p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
                    <span className={`font-medium ${isCorrect ? 'text-emerald-900 dark:text-emerald-300' : 'text-rose-900 dark:text-rose-300'}`}>
                      {matchedVal || '[Not answered]'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-semibold">
                          <XCircle className="w-4 h-4 text-rose-600" /> Correct: <strong>{pair.answer}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full flex items-center gap-1.5">
                    <select
                      value={matchedVal}
                      onChange={(e) => handlePair(pair.prompt, e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-md border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer ${
                        matchedVal ? 'border-slate-900 dark:border-slate-600 font-medium' : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <option value="">Choose matching item...</option>
                      {allAnswerOptions.map((opt, oIdx) => (
                        <option key={oIdx} value={opt} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {opt}
                        </option>
                      ))}
                    </select>

                    {matchedVal && (
                      <button
                        type="button"
                        onClick={() => handleUnpair(pair.prompt)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Clear pairing"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Answers Tray (for click-to-pair) */}
      {!isReview && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 transition-colors">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Available Answer Pool:</span>
            {selectedPrompt ? (
              <span className="text-black dark:text-white font-bold animate-pulse">
                Click an answer to match with "{selectedPrompt}"
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">Click a prompt above first, then click an answer below</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {allAnswerOptions.map((ans, aIdx) => {
              const isUsed = Object.values(currentMatches).includes(ans);

              return (
                <button
                  key={aIdx}
                  type="button"
                  disabled={!selectedPrompt}
                  onClick={() => selectedPrompt && handlePair(selectedPrompt, ans)}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                    selectedPrompt
                      ? 'border-slate-800 dark:border-white bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 shadow-2xs cursor-pointer'
                      : isUsed
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-default'
                  }`}
                >
                  {ans}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
