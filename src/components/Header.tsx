import React from 'react';
import { HelpCircle, RefreshCw, BookOpen } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div
            onClick={onResetQuiz}
            className="flex items-center gap-2 cursor-pointer group"
            title="Quiz Player - Home"
          >
            {/* Visual Logo glyph matching reference */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-black rounded-full shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="white">
                <polygon points="6,3 20,12 6,21" />
              </svg>
              {/* Q handle notch */}
              <div className="absolute -bottom-1 -right-0.5 w-2.5 h-3 bg-black rounded-xs transform rotate-45" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-black leading-none group-hover:text-slate-700 transition-colors">
                QUIZ<span className="text-slate-800">PLAYER</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-500 leading-tight">
                Assessment System
              </span>
            </div>
          </div>

          {quizTitle && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current:</span>
              <span className="text-xs font-medium text-slate-700 truncate max-w-xs">{quizTitle}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showReset && onResetQuiz && (
            <button
              onClick={onResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Start a new quiz or load another file"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Quiz</span>
            </button>
          )}

          {/* Dedicated ? Authoring Guide Button */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors shadow-xs"
            title="Open Authoring Guide & Prompts (?)"
          >
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Authoring Guide</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-500">?</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
