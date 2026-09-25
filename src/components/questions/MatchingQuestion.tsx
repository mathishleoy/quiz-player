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
      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 bg-white">
        {question.pairs.map((pair, idx) => {
          const matchedVal = currentMatches[pair.prompt] || '';
          const isSelected = selectedPrompt === pair.prompt;
          const isCorrect = matchedVal === pair.answer;

          return (
            <div
              key={idx}
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isSelected ? 'bg-slate-100' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
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
                      ? 'border-black bg-black text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <span className="leading-snug">{pair.prompt}</span>
                  {!isReview && (
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </button>
              </div>

              {/* Match Selector / Display (Moodle style dropdown) */}
              <div className="flex items-center gap-2 sm:w-1/2 justify-end">
                {isReview ? (
                  <div className="w-full flex items-center justify-between gap-2 p-2 rounded-md border text-xs">
                    <span className={`font-medium ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {matchedVal || '[Not answered]'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 font-semibold">
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
                      className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-md border bg-white text-slate-800 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black cursor-pointer ${
                        matchedVal ? 'border-slate-900 font-medium' : 'border-slate-300 text-slate-500'
                      }`}
                    >
                      <option value="">Choose matching item...</option>
                      {allAnswerOptions.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {matchedVal && (
                      <button
                        type="button"
                        onClick={() => handleUnpair(pair.prompt)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
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
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
            <span>Available Answer Pool:</span>
            {selectedPrompt ? (
              <span className="text-black font-bold animate-pulse">
                Click an answer to match with "{selectedPrompt}"
              </span>
            ) : (
              <span className="text-slate-400">Click a prompt above first, then click an answer below</span>
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
                      ? 'border-slate-800 bg-white hover:bg-slate-900 hover:text-white shadow-2xs cursor-pointer'
                      : isUsed
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 bg-white text-slate-700 cursor-default'
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
