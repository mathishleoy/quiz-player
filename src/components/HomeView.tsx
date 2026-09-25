import React, { useRef, useState } from 'react';
import { Download, Upload, Play, AlertCircle, FileJson, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { validateAndParseQuiz, shuffleArray } from '../utils/quizValidator';
import { QUIZ_TEMPLATE_JSON, BLANK_TEMPLATE_JSON } from '../data/template';
import { QuizQuestion } from '../types/quiz';

interface HomeViewProps {
  onQuizLoaded: (quiz: { title: string; description: string; questions: QuizQuestion[] }) => void;
  onOpenGuide: () => void;
  onDownloadTemplate: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onQuizLoaded,
  onOpenGuide,
  onDownloadTemplate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processJsonFile = (file: File) => {
    setErrorMessage(null);
    setErrorDetails([]);
    setIsProcessing(true);

    if (!file.name.endsWith('.json')) {
      setErrorMessage('Please upload a valid .json file.');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setIsProcessing(false);
      const content = e.target?.result as string;
      if (!content) {
        setErrorMessage('Uploaded file is empty.');
        return;
      }

      const result = validateAndParseQuiz(content);
      if (!result.isValid || !result.quiz) {
        setErrorMessage('The uploaded JSON does not match the Quiz Player format.');
        setErrorDetails(result.errors);
        return;
      }

      // Shuffle questions in fully random order as required!
      const shuffledQuestions = shuffleArray(result.quiz.questions);
      onQuizLoaded({
        ...result.quiz,
        questions: shuffledQuestions,
      });
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Failed to read the file. Please check file permissions and try again.');
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processJsonFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processJsonFile(file);
    }
  };

  const handleLoadSampleQuiz = () => {
    setErrorMessage(null);
    setErrorDetails([]);
    const validation = validateAndParseQuiz(JSON.stringify(QUIZ_TEMPLATE_JSON));
    if (validation.isValid && validation.quiz) {
      // Shuffled random order
      const shuffled = shuffleArray(validation.quiz.questions);
      onQuizLoaded({
        ...validation.quiz,
        questions: shuffled,
      });
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-10">
      {/* Top action row with Authoring Guide button */}
      <div className="flex justify-end items-center">
        <button
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors shadow-2xs"
          title="Open Authoring Guide & Prompts (?)"
        >
          <HelpCircle className="w-4 h-4 text-slate-700" />
          <span>Authoring Guide</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono bg-slate-50 border border-slate-300 rounded text-slate-500">?</kbd>
        </button>
      </div>

      {/* Brand Logo & Presentation */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Render crisp brand logo lockup matching reference */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-black rounded-full shadow-md">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 ml-1" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
            <div className="absolute -bottom-1.5 -right-1 w-4 h-5 bg-black rounded-xs transform rotate-45" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black leading-none">
              QUIZ<span className="text-slate-800">PLAYER</span>
            </h1>
            <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mt-1">
              Assessment Engine
            </p>
          </div>
        </div>

        <p className="text-slate-600 max-w-lg text-sm sm:text-base leading-relaxed">
          Interactive quiz player supporting 8 question formats with automatic scoring, partial credit, and Moodle-styled review.
        </p>
      </div>

      {/* Main Load Quiz Box */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-1 border-b border-slate-200 pb-5">
          <h2 className="text-xl font-bold text-slate-900">Load Quiz Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Download a clean template or upload your pre-generated question file (.json).
          </p>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-black bg-slate-50 scale-[1.01]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag and drop your questions file here
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Supports .json formatted quiz files</p>
            </div>
          </div>
        </div>

        {/* The Two Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Button 1: Download JSON Template */}
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all shadow-2xs hover:shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download JSON Template</span>
          </button>

          {/* Button 2: Upload Questions File */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-black hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Questions File</span>
          </button>
        </div>

        {/* Error message display under buttons */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs sm:text-sm space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">{errorMessage}</span>
                {errorDetails.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-xs text-rose-700 bg-white/70 p-2.5 rounded border border-rose-200">
                    {errorDetails.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {errorDetails.length > 5 && (
                      <li className="italic">...and {errorDetails.length - 5} more issue(s).</li>
                    )}
                  </ul>
                )}
                <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex items-center justify-between">
                  <span className="text-xs text-rose-600">Need help formatting your JSON?</span>
                  <button
                    onClick={onOpenGuide}
                    className="text-xs font-semibold text-rose-900 underline hover:no-underline"
                  >
                    Open Authoring Guide &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Demo Quiz / Sample Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
          <span>Don't have a file ready right now?</span>
          <button
            type="button"
            onClick={handleLoadSampleQuiz}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try Sample Quiz (All 8 Question Types)</span>
          </button>
        </div>
      </div>

      {/* Feature Pills / Supported Types overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="font-bold text-slate-800 block">MCQ & Scenario</span>
          <span className="text-slate-500 text-[11px]">Selectable cards & case studies</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="font-bold text-slate-800 block">Multi-Select & Blanks</span>
          <span className="text-slate-500 text-[11px]">Checkboxes & inline text inputs</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="font-bold text-slate-800 block">Matching & Ordering</span>
          <span className="text-slate-500 text-[11px]">Click-to-match & sequence drag</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="font-bold text-slate-800 block">Classification & Short</span>
          <span className="text-slate-500 text-[11px]">Category buckets & text validation</span>
        </div>
      </div>
    </div>
  );
};
