import React, { useEffect, useState } from 'react';
import { OrderingQuestionData, QuestionScoreResult } from '../../types/quiz';
import { shuffleArray } from '../../utils/quizValidator';
import { ChevronUp, ChevronDown, GripVertical, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface OrderingQuestionProps {
  question: OrderingQuestionData;
  answer?: string[];
  onChange: (val: string[]) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const OrderingQuestion: React.FC<OrderingQuestionProps> = ({
  question,
  answer,
  onChange,
  isReview = false,
  scoreResult,
}) => {
  // If answer is not yet initialized, initialize with shuffled version
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const items = React.useMemo(() => {
    if (Array.isArray(answer) && answer.length === question.items.length) {
      return answer;
    }
    // Shuffled version
    let shuffled = shuffleArray(question.items);
    // ensure not identical to answer if possible
    if (shuffled.join(',') === question.items.join(',') && question.items.length > 1) {
      shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
    }
    return shuffled;
  }, [question.id, question.items]);

  useEffect(() => {
    if (!answer || answer.length !== question.items.length) {
      onChange(items);
    }
  }, []);

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (isReview) return;
    if (toIdx < 0 || toIdx >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    onChange(newItems);
  };

  const handleResetShuffle = () => {
    if (isReview) return;
    const shuffled = shuffleArray(question.items);
    onChange(shuffled);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isReview) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isReview || draggedIndex === null || draggedIndex === index) return;
    moveItem(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Arrange items in the correct order:
        </div>
        {!isReview && (
          <button
            type="button"
            onClick={handleResetShuffle}
            className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Shuffle again"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reshuffle</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isCorrectPosition = isReview && question.items[idx] === item;
          const isWrongPosition = isReview && question.items[idx] !== item;

          return (
            <div
              key={`${item}-${idx}`}
              draggable={!isReview}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-slate-900 transition-all ${
                isReview
                  ? isCorrectPosition
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30'
                  : draggedIndex === idx
                  ? 'border-black dark:border-white opacity-40 shadow-inner'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs'
              }`}
            >
              {/* Drag Grip Handle */}
              {!isReview ? (
                <div
                  className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-4 shrink-0" />
              )}

              {/* Sequence Order Number */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                  isReview
                    ? isCorrectPosition
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {idx + 1}
              </div>

              {/* Item Content */}
              <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {item}
              </div>

              {/* Status / Quick Move Buttons */}
              {isReview ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                  {isCorrectPosition ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      Expected #{question.items.indexOf(item) + 1}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, idx - 1)}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, idx + 1)}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isReview && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Official Correct Sequence:</div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
            {question.items.map((it, i) => (
              <li key={i}>
                <span className="font-medium text-slate-800 dark:text-slate-200">{it}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
