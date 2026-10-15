import React, { useMemo, useState, useRef } from 'react';
import { OrderingQuestionData, QuestionScoreResult } from '../../types/quiz';
import { shuffleArray } from '../../utils/quizValidator';
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUpDown,
  Check,
} from 'lucide-react';

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const touchStartIndex = useRef<number | null>(null);
  const touchOverIndex = useRef<number | null>(null);

  // Map each original item to its correct sequence number (1-based)
  const itemOriginalIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    question.items.forEach((it, i) => {
      if (!map.has(it)) {
        map.set(it, i + 1);
      }
    });
    return map;
  }, [question.items]);

  // Initial shuffled order generated once per question ID
  const initialShuffled = useMemo(() => {
    let shuffled = shuffleArray(question.items);
    if (
      shuffled.join('|||') === question.items.join('|||') &&
      question.items.length > 1
    ) {
      shuffled = [shuffled[1], ...shuffled.slice(2), shuffled[0]];
    }
    return shuffled;
  }, [question.id]);

  // Derive current ordered items from answer prop, or fallback to initialShuffled
  const items: string[] = useMemo(() => {
    if (Array.isArray(answer) && answer.length === question.items.length) {
      return answer;
    }
    return initialShuffled;
  }, [answer, question.items.length, initialShuffled]);

  const hasSavedAnswer = Array.isArray(answer) && answer.length === question.items.length;

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (isReview) return;
    if (fromIdx < 0 || fromIdx >= items.length) return;
    if (toIdx < 0 || toIdx >= items.length) return;
    if (fromIdx === toIdx) return;

    const next = [...items];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
    setSelectedSlot(null);
  };

  const handleResetShuffle = () => {
    if (isReview) return;
    let shuffled = shuffleArray(question.items);
    if (
      shuffled.join('|||') === items.join('|||') &&
      question.items.length > 1
    ) {
      shuffled = [shuffled[1], ...shuffled.slice(2), shuffled[0]];
    }
    onChange(shuffled);
    setSelectedSlot(null);
  };

  const handleSaveCurrentOrder = () => {
    if (isReview) return;
    onChange([...items]);
  };

  const handleSlotClick = (idx: number) => {
    if (isReview) return;
    if (selectedSlot === null) {
      setSelectedSlot(idx);
    } else if (selectedSlot === idx) {
      setSelectedSlot(null);
    } else {
      moveItem(selectedSlot, idx);
      setSelectedSlot(null);
    }
  };

  // --- HTML5 Desktop Drag and Drop handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isReview) return;
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';

    // Drag the whole card with its number badge and text
    const target = e.currentTarget as HTMLElement;
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(target, 30, 25);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (isReview) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (isReview) return;
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    if (isReview) return;
    e.preventDefault();
    e.stopPropagation();

    const dataText = e.dataTransfer.getData('text/plain');
    const sourceIdx = draggedIndex !== null ? draggedIndex : parseInt(dataText, 10);

    if (
      !isNaN(sourceIdx) &&
      sourceIdx >= 0 &&
      sourceIdx < items.length &&
      sourceIdx !== targetIdx
    ) {
      moveItem(sourceIdx, targetIdx);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // --- Mobile Touch Drag handlers for flexible touch support ---
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (isReview) return;
    touchStartIndex.current = index;
    touchOverIndex.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isReview || touchStartIndex.current === null) return;
    const touch = e.touches[0];
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardEl = targetEl?.closest('[data-ordering-index]');
    if (cardEl) {
      const targetIdx = parseInt(cardEl.getAttribute('data-ordering-index') || '', 10);
      if (!isNaN(targetIdx) && targetIdx !== touchOverIndex.current) {
        touchOverIndex.current = targetIdx;
        setDragOverIndex(targetIdx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isReview || touchStartIndex.current === null) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      touchStartIndex.current = null;
      touchOverIndex.current = null;
      return;
    }

    const sourceIdx = touchStartIndex.current;
    const targetIdx = touchOverIndex.current;

    if (targetIdx !== null && targetIdx !== sourceIdx) {
      moveItem(sourceIdx, targetIdx);
    }

    touchStartIndex.current = null;
    touchOverIndex.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Header controls & helper information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <span>Arrange items in the correct order:</span>
          </div>
          {!isReview && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag anywhere on an item, use the <strong className="font-semibold text-slate-700 dark:text-slate-300">↑ / ↓ arrows</strong>, or tap two items to swap.
            </p>
          )}
        </div>

        {!isReview && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {!hasSavedAnswer && (
              <button
                type="button"
                onClick={handleSaveCurrentOrder}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-2xs"
                title="Confirm and save the current order as your answer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Keep Order</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleResetShuffle}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors shadow-2xs"
              title="Reshuffle all items into a new random order"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reshuffle</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected slot notification banner */}
      {!isReview && selectedSlot !== null && (
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between animate-in fade-in duration-150">
          <span>
            Selected <strong>#{itemOriginalIndexMap.get(items[selectedSlot]) ?? selectedSlot + 1}</strong> ("{items[selectedSlot]}"). Click another item to move it there.
          </span>
          <button
            type="button"
            onClick={() => setSelectedSlot(null)}
            className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:underline ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Ordering List Items with Slot Position Headers and Moving Number Badges */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          // Identify the item's original number so the number badge travels WITH the text!
          const itemNum = itemOriginalIndexMap.get(item) ?? (idx + 1);

          // Handle if item text already starts with a number like "1. Text"
          const embeddedMatch = item.match(/^(\d+)[\.\)\-\:]\s*(.*)$/);
          const itemDisplayNumber = embeddedMatch ? parseInt(embeddedMatch[1], 10) : itemNum;
          const itemDisplayText = embeddedMatch ? embeddedMatch[2] : item;

          const isCorrectPosition = isReview && question.items[idx] === item;
          const isWrongPosition = isReview && question.items[idx] !== item;
          const isSelected = selectedSlot === idx;
          const isBeingDragged = draggedIndex === idx;
          const isDropTarget = dragOverIndex === idx && draggedIndex !== idx;

          return (
            <div
              key={`${item}-${idx}`}
              data-ordering-index={idx}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Slot Target Indicator on the left */}
              <div
                className="w-14 sm:w-16 shrink-0 text-right pr-1 select-none"
                title={`Target Slot ${idx + 1}`}
              >
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                  Slot {idx + 1}
                </span>
              </div>

              {/* Draggable Card containing the NUMBER BADGE and the TEXT as ONE solid movable unit */}
              <div
                draggable={!isReview}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={(e) => handleDragLeave(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, idx)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => !isReview && handleSlotClick(idx)}
                className={`flex-1 group flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-lg border transition-all select-none ${
                  !isReview ? 'cursor-grab active:cursor-grabbing' : ''
                } ${
                  isReview
                    ? isCorrectPosition
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                      : 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30'
                    : isBeingDragged
                    ? 'border-dashed border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 opacity-40 shadow-inner scale-[0.98]'
                    : isDropTarget
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500 scale-[1.01] shadow-md'
                    : isSelected
                    ? 'border-black dark:border-white ring-2 ring-black dark:ring-white bg-slate-50 dark:bg-slate-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs'
                }`}
              >
                {/* Drag Grip Handle */}
                {!isReview ? (
                  <div
                    className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 p-0.5 rounded transition-colors shrink-0"
                    title="Drag and drop anywhere on this card"
                  >
                    <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                ) : (
                  <div className="w-4 shrink-0" />
                )}

                {/* THE NUMBER BADGE — Tied directly to the item and moves WITH the item! */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs sm:text-sm font-extrabold shrink-0 shadow-2xs transition-colors ${
                    isReview
                      ? isCorrectPosition
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-black dark:bg-white text-white dark:text-slate-950 scale-105'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-800 dark:border-slate-200'
                  }`}
                  title={`Item #${itemDisplayNumber}`}
                >
                  {itemDisplayNumber}
                </div>

                {/* ITEM CONTENT TEXT — Moves side-by-side with its number badge */}
                <div className="flex-1 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {itemDisplayText}
                </div>

                {/* Review status feedback OR Interactive Move Arrow Controls */}
                {isReview ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                    {isCorrectPosition ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">Correct</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1 font-semibold">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span className="hidden sm:inline">Expected Slot</span> #{question.items.indexOf(item) + 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Move Up Button */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, idx - 1)}
                      className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors disabled:opacity-25 disabled:pointer-events-none shadow-2xs"
                      title={`Move item #${itemDisplayNumber} up to Slot ${idx}`}
                      aria-label="Move item up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* Move Down Button */}
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, idx + 1)}
                      className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors disabled:opacity-25 disabled:pointer-events-none shadow-2xs"
                      title={`Move item #${itemDisplayNumber} down to Slot ${idx + 2}`}
                      aria-label="Move item down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Mode: Expected order answer callout */}
      {isReview && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1.5">
          <div className="font-semibold text-slate-800 dark:text-slate-200">Official Correct Sequence:</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
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
