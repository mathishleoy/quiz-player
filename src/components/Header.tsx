import React from 'react';
import { HelpCircle, RefreshCw, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  quizTitle?: string;
  onOpenGuide: () => void;
  onResetQuiz?: () => void;
  showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  quizTitle,
  onOpenGuide,
  onResetQuiz,
  showReset = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div
            onClick={onResetQuiz}
            className="flex items-center gap-2 cursor-pointer group"
            title="Quiz Player - Home"
          >
            {/* Visual Logo glyph matching reference */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-black dark:bg-white rounded-full shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" className="text-white dark:text-slate-950" />
              </svg>
              {/* Q handle notch */}
              <div className="absolute -bottom-1 -right-0.5 w-2.5 h-3 bg-black dark:bg-white rounded-xs transform rotate-45" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-black dark:text-white leading-none group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                QUIZ<span className="text-slate-800 dark:text-slate-300">PLAYER</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 dark:text-slate-400 leading-tight">
                Assessment System
              </span>
            </div>
          </div>

          {quizTitle && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current:</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-xs">{quizTitle}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showReset && onResetQuiz && (
            <button
              onClick={onResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Start a new quiz or load another file"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Quiz</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Dedicated ? Authoring Guide Button */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-md transition-colors shadow-xs"
            title="Open Authoring Guide & Prompts (?)"
          >
            <HelpCircle className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="hidden sm:inline">Authoring Guide</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">?</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
