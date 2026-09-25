import React from 'react';
import { QuizQuestion, UserAnswerValue, QuestionScoreResult } from '../types/quiz';
import { Flag, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { MCQQuestion } from './questions/MCQQuestion';
import { MultipleSelectQuestion } from './questions/MultipleSelectQuestion';
import { FillBlankQuestion } from './questions/FillBlankQuestion';
import { ShortAnswerQuestion } from './questions/ShortAnswerQuestion';
import { MatchingQuestion } from './questions/MatchingQuestion';
import { OrderingQuestion } from './questions/OrderingQuestion';
import { ClassificationQuestion } from './questions/ClassificationQuestion';
import { ScenarioQuestion } from './questions/ScenarioQuestion';
import { isQuestionAnswered } from '../utils/scoring';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  totalQuestions: number;
  userAnswer: UserAnswerValue;
  onAnswerChange: (val: UserAnswerValue) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  isFlagged,
  onToggleFlag,
  isReview = false,
  scoreResult,
}) => {
  const answered = isQuestionAnswered(question, userAnswer);

  // Moodle state indicators
  const renderMoodleStatus = () => {
    if (isReview && scoreResult) {
      if (scoreResult.isCorrect) {
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Correct</span>
          </div>
        );
      }
      if (scoreResult.isPartial) {
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Partially correct</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          <span>Incorrect</span>
        </div>
      );
    }

    if (answered) {
      return (
        <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          Answer saved
        </div>
      );
    }

    return (
      <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
        Not yet answered
      </div>
    );
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <MCQQuestion
            question={question}
            answer={userAnswer as number}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'multiple_select':
        return (
          <MultipleSelectQuestion
            question={question}
            answer={userAnswer as number[]}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={question}
            answer={userAnswer as string[]}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'short_answer':
        return (
          <ShortAnswerQuestion
            question={question}
            answer={userAnswer as string}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            question={question}
            answer={userAnswer as Record<string, string>}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'ordering':
        return (
          <OrderingQuestion
            question={question}
            answer={userAnswer as string[]}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'classification':
        return (
          <ClassificationQuestion
            question={question}
            answer={userAnswer as Record<string, string[]>}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      case 'scenario':
        return (
          <ScenarioQuestion
            question={question}
            answer={userAnswer as number}
            onChange={onAnswerChange}
            isReview={isReview}
            scoreResult={scoreResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Moodle Classic Side Info Block */}
      <div className="w-full md:w-48 bg-slate-100/90 border border-slate-300 rounded-lg p-3 text-slate-700 shrink-0 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between md:flex-col md:items-start gap-1">
          <span className="font-bold text-sm text-slate-900">
            Question <span className="text-black font-extrabold">{index + 1}</span>
          </span>
          {renderMoodleStatus()}
        </div>

        <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 flex items-center justify-between md:block">
          <span>
            {isReview && scoreResult ? (
              <span>
                Mark <strong className="font-semibold text-slate-900">{scoreResult.earned.toFixed(2)}</strong> out of 1.00
              </span>
            ) : (
              <span>Marked out of 1.00</span>
            )}
          </span>

          {/* Flag Question Button */}
          {!isReview && (
            <button
              type="button"
              onClick={onToggleFlag}
              className={`mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isFlagged
                  ? 'text-rose-600 hover:text-rose-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
              <span>{isFlagged ? 'Flagged' : 'Flag question'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Question Formulation Box */}
      <div className="flex-1 w-full bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-xs space-y-6">
        {/* Question Prompt */}
        <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
          {question.text}
        </div>

        {/* Question Interactive Body */}
        <div className="pt-1">{renderQuestionType()}</div>

        {/* Review Feedback Block (Moodle Standard) */}
        {isReview && scoreResult && (
          <div className="border-t border-slate-200 pt-5 space-y-3">
            {/* Feedback Callout */}
            <div
              className={`p-4 rounded-lg border text-xs sm:text-sm space-y-1.5 ${
                scoreResult.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : scoreResult.isPartial
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  {scoreResult.isCorrect
                    ? 'Your answer is correct.'
                    : scoreResult.isPartial
                    ? 'Your answer is partially correct.'
                    : 'Your answer is incorrect.'}
                </span>
              </div>

              {!scoreResult.isCorrect && (
                <div className="text-xs pt-1">
                  <span className="font-semibold">The correct answer is: </span>
                  <span className="font-medium underline decoration-slate-300">{scoreResult.correctAnswerSummary}</span>
                </div>
              )}

              {scoreResult.feedback && (
                <div className="pt-2 text-xs border-t border-slate-200/60 text-slate-700">
                  <span className="font-semibold text-slate-800">Feedback: </span>
                  <span>{scoreResult.feedback}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
