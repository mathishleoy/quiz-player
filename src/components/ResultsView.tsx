import React, { useEffect } from 'react';
import { QuizAttemptResult, QuizQuestion } from '../types/quiz';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertTriangle, XCircle, Eye, RotateCcw, Award, Clock } from 'lucide-react';

interface ResultsViewProps {
  quizTitle: string;
  attemptResult: QuizAttemptResult;
  questions: QuizQuestion[];
  onReviewAnswers: (targetIndex?: number) => void;
  onRestartQuiz: () => void;
  elapsedSeconds?: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quizTitle,
  attemptResult,
  questions,
  onReviewAnswers,
  onRestartQuiz,
  elapsedSeconds = 0,
}) => {
  const { totalEarned, totalPossible, percentage, questionResults } = attemptResult;

  // Trigger celebration confetti if good score
  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#10B981', '#3B82F6', '#F59E0B'],
      });
    }
  }, [percentage]);

  const correctCount = Object.values(questionResults).filter((r) => r.isCorrect).length;
  const partialCount = Object.values(questionResults).filter((r) => r.isPartial).length;
  const incorrectCount = Object.values(questionResults).filter((r) => r.isIncorrect).length;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const getGradeCommentary = () => {
    if (percentage >= 90) return 'Outstanding achievement! You demonstrated thorough mastery of the material.';
    if (percentage >= 75) return 'Well done! A solid performance across the majority of question concepts.';
    if (percentage >= 50) return 'Pass achieved. Review the missed questions to reinforce key concepts.';
    return 'Attempt finished. Take time to review the answer explanations below to strengthen your understanding.';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Title & Attempt Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Attempt Finished</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{quizTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            {getGradeCommentary()}
          </p>
        </div>

        {/* Grade Highlights (Moodle Academic Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 block">Grade</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-black font-mono mt-1">
              {percentage}%
            </div>
            <span className="text-[11px] text-slate-500">
              {totalEarned.toFixed(2)} / {totalPossible.toFixed(2)} pts
            </span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-lg border border-emerald-200">
            <span className="text-xs uppercase font-semibold tracking-wider text-emerald-800 block">Correct</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono mt-1">
              {correctCount}
            </div>
            <span className="text-[11px] text-emerald-600">Full marks</span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-200">
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-800 block">Partial</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono mt-1">
              {partialCount}
            </div>
            <span className="text-[11px] text-amber-600">Partial marks</span>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-lg border border-rose-200">
            <span className="text-xs uppercase font-semibold tracking-wider text-rose-800 block">Incorrect</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono mt-1">
              {incorrectCount}
            </div>
            <span className="text-[11px] text-rose-600">Needs review</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onReviewAnswers(0)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-all shadow-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Review Answers & Feedback</span>
          </button>

          <button
            type="button"
            onClick={onRestartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-sm transition-all shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Start New Quiz</span>
          </button>
        </div>
      </div>

      {/* Per-Question Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-base font-bold text-slate-900">Per-Question Breakdown</h2>
          {elapsedSeconds > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Time taken: {formatTime(elapsedSeconds)}</span>
            </div>
          )}
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Marks</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {questions.map((q, idx) => {
                const res = questionResults[q.id];
                const earned = res?.earned ?? 0;

                return (
                  <tr
                    key={q.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onReviewAnswers(idx)}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {q.text}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-semibold text-slate-500">
                      {q.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      <strong>{earned.toFixed(2)}</strong> / 1.00
                    </td>
                    <td className="py-3 px-4 text-center">
                      {res?.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Correct
                        </span>
                      ) : res?.isPartial ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Partial
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Incorrect
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReviewAnswers(idx);
                        }}
                        className="text-xs font-semibold text-black hover:underline"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
