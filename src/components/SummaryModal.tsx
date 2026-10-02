import React from 'react';
import { QuizQuestion, UserAnswerValue } from '../types/quiz';
import { isQuestionAnswered } from '../utils/scoring';
import { X, CheckCircle, AlertCircle, ArrowLeft, Send, Flag } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  userAnswers: Record<string, UserAnswerValue>;
  flaggedQuestions: Set<string>;
  onJumpToQuestion: (index: number) => void;
  onConfirmSubmit: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  questions,
  userAnswers,
  flaggedQuestions,
  onJumpToQuestion,
  onConfirmSubmit,
}) => {
  if (!isOpen) return null;

  const answeredCount = questions.filter((q) => isQuestionAnswered(q, userAnswers[q.id])).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Summary of Attempt</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review your question status before submitting your final attempt.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {unansweredCount > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <span>
                You have <strong>{unansweredCount} unanswered</strong> question(s). You can return to complete them or submit now.
              </span>
            </div>
          )}

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Question</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {questions.map((q, idx) => {
                  const answered = isQuestionAnswered(q, userAnswers[q.id]);
                  const isFlagged = flaggedQuestions.has(q.id);

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => onJumpToQuestion(idx)}
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>Question {idx + 1}</span>
                        {isFlagged && (
                          <span className="flex items-center text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            <Flag className="w-2.5 h-2.5 mr-0.5 fill-rose-600" /> Flagged
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {answered ? (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Answer saved
                          </span>
                        ) : (
                          <span className="font-normal text-rose-600 dark:text-rose-400 italic">
                            Not yet answered
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onJumpToQuestion(idx);
                          }}
                          className="text-xs font-semibold text-black dark:text-white hover:underline"
                        >
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to attempt</span>
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-lg font-semibold transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Submit all and finish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
