import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Sparkles, ExternalLink } from 'lucide-react';

interface FeedbackFloatingWidgetProps {
  onOpenGuide: () => void;
}

const FEEDBACK_SEEN_KEY = 'quiz_player_feedback_widget_seen_v1';

export const FeedbackFloatingWidget: React.FC<FeedbackFloatingWidgetProps> = ({ onOpenGuide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(FEEDBACK_SEEN_KEY) === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(FEEDBACK_SEEN_KEY, 'true');
        }
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Popup Card */}
      {isOpen && (
        <div
          className="mb-3 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-label="Feedback and suggestions"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Problems or Improvements?
                </h4>
                <p className="text-[11px] text-slate-500">I'd love to hear your feedback!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Text */}
          <p className="py-3 text-xs text-slate-600 leading-relaxed">
            Have questions, caught a bug, or have a suggestion for new features? Reach out directly via Instagram or TikTok:
          </p>

          {/* Social Channels List */}
          <div className="space-y-2">
            {/* Instagram Link */}
            <a
              href="https://instagram.com/mathishleoy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 group-hover:text-pink-600 transition-colors">DM on Instagram</span>
                  <span className="text-[11px] text-slate-400">@mathishleoy</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-colors" />
            </a>

            {/* TikTok Link */}
            <a
              href="https://tiktok.com/@mathishleoy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V8.98a6.38 6.38 0 00-.79-.05A6.33 6.33 0 003 15.26a6.33 6.33 0 006.34 6.34 6.33 6.33 0 006.34-6.34V9.08a8.21 8.21 0 004.91 1.57v-3.5a4.83 4.83 0 01-1-.46z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 group-hover:text-black transition-colors">Reach out on TikTok</span>
                  <span className="text-[11px] text-slate-400">@mathishleoy</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/mathishleoy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 group-hover:text-black transition-colors">GitHub Profile</span>
                  <span className="text-[11px] text-slate-400">@mathishleoy</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
            </a>
          </div>

          {/* Quick Help Guide Link */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need authoring tips?</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenGuide();
              }}
              className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-black underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide & Prompts</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button - Clean Logo Only, No Text, No Flashing */}
      <div className="relative">
        {/* Helper pill shown ONLY for first-time visitors who haven't touched it yet */}
        {!isOpen && !hasInteracted && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full shadow-lg whitespace-nowrap">
            <span>Problems or ideas? Reach out!</span>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -right-1 top-1/2 -translate-y-1/2" />
          </div>
        )}

        <button
          onClick={handleToggle}
          className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-hidden ${
            isOpen
              ? 'bg-slate-800 rotate-90 shadow-xl'
              : 'bg-black hover:bg-slate-800'
          }`}
          aria-expanded={isOpen}
          aria-label="Help and feedback"
          title="Problems, ideas, or feedback? Click to reach out"
        >
          {isOpen ? (
            <X className="w-5 h-5 transition-transform" />
          ) : (
            <HelpCircle className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

