import React, { useState } from 'react';
import { ClassificationQuestionData, QuestionScoreResult } from '../../types/quiz';
import { CheckCircle2, XCircle, FolderPlus, X } from 'lucide-react';

interface ClassificationQuestionProps {
  question: ClassificationQuestionData;
  answer?: Record<string, string[]>;
  onChange: (val: Record<string, string[]>) => void;
  isReview?: boolean;
  scoreResult?: QuestionScoreResult;
}

export const ClassificationQuestion: React.FC<ClassificationQuestionProps> = ({
  question,
  answer = {},
  onChange,
  isReview = false,
  scoreResult,
}) => {
  const currentClassification: Record<string, string[]> =
    typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {};

  // Find items assigned to any category
  const assignedItemTexts = new Set<string>();
  Object.values(currentClassification).forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((t) => assignedItemTexts.add(t));
    }
  });

  // Unassigned items
  const unassignedItems = question.items.filter((it) => !assignedItemTexts.has(it.text));

  const [selectedUnassignedItem, setSelectedUnassignedItem] = useState<string | null>(null);

  const assignItem = (itemText: string, targetCategory: string) => {
    if (isReview) return;
    const next: Record<string, string[]> = {};
    question.categories.forEach((c) => {
      next[c] = [...(currentClassification[c] || [])].filter((t) => t !== itemText);
    });
    if (targetCategory) {
      if (!next[targetCategory]) next[targetCategory] = [];
      next[targetCategory].push(itemText);
    }
    onChange(next);
    setSelectedUnassignedItem(null);
  };

  const removeItem = (itemText: string) => {
    if (isReview) return;
    const next: Record<string, string[]> = {};
    question.categories.forEach((c) => {
      next[c] = [...(currentClassification[c] || [])].filter((t) => t !== itemText);
    });
    onChange(next);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemText: string) => {
    if (isReview) return;
    e.dataTransfer.setData('text/plain', itemText);
  };

  const handleDropOnCategory = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (isReview) return;
    const itemText = e.dataTransfer.getData('text/plain');
    if (itemText) {
      assignItem(itemText, category);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Classify items into their respective categories:
        </div>
        {!isReview && (
          <span className="text-xs text-slate-500 italic hidden sm:inline">
            Drag items into columns or click an item then click a category
          </span>
        )}
      </div>

      {/* Unassigned Items Pool */}
      {!isReview && unassignedItems.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 transition-colors">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Items to categorize ({unassignedItems.length} remaining):</span>
            {selectedUnassignedItem && (
              <span className="text-black dark:text-white font-bold animate-pulse">
                Click a category below to place "{selectedUnassignedItem}"
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {unassignedItems.map((item, idx) => {
              const isSelected = selectedUnassignedItem === item.text;
              return (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.text)}
                  onClick={() => setSelectedUnassignedItem(isSelected ? null : item.text)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-black dark:bg-white text-white dark:text-slate-950 border-black dark:border-white shadow-xs ring-2 ring-black dark:ring-white'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-400 hover:shadow-2xs'
                  }`}
                >
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Buckets */}
      <div
        className={`grid gap-4 ${
          question.categories.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : question.categories.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {question.categories.map((category, catIdx) => {
          const categoryItems = currentClassification[category] || [];
          const isTargetForSelected = selectedUnassignedItem !== null;

          return (
            <div
              key={catIdx}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnCategory(e, category)}
              onClick={() => {
                if (selectedUnassignedItem) {
                  assignItem(selectedUnassignedItem, category);
                }
              }}
              className={`rounded-lg border bg-white dark:bg-slate-900 flex flex-col min-h-[160px] transition-all ${
                isTargetForSelected && !isReview
                  ? 'border-black dark:border-white ring-1 ring-black dark:ring-white bg-slate-50 dark:bg-slate-800 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Category Header */}
              <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide truncate">
                  {category}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {categoryItems.length}
                </span>
              </div>

              {/* Items in this category */}
              <div className="p-3 flex-1 space-y-2">
                {categoryItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic py-6">
                    {isReview ? 'No items placed' : 'Drop or assign items here'}
                  </div>
                ) : (
                  categoryItems.map((itemText, itIdx) => {
                    const originalItem = question.items.find((it) => it.text === itemText);
                    const isCorrect = originalItem?.category === category;

                    return (
                      <div
                        key={itIdx}
                        className={`p-2 rounded-md border text-xs flex items-center justify-between gap-1.5 transition-colors ${
                          isReview
                            ? isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
                        }`}
                      >
                        <span className="font-medium truncate">{itemText}</span>

                        {isReview ? (
                          <div className="shrink-0 flex items-center">
                            {isCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <span
                                className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-1 py-0.5 rounded"
                                title={`Belongs in ${originalItem?.category}`}
                              >
                                &rarr; {originalItem?.category}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(itemText);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            title="Remove from category"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
