import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswerValue, QuizAttemptResult } from './types/quiz';
import { BLANK_TEMPLATE_JSON } from './data/template';
import { scoreFullQuiz } from './utils/scoring';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { QuizPlayView } from './components/QuizPlayView';
import { SummaryModal } from './components/SummaryModal';
import { ResultsView } from './components/ResultsView';
import { AuthoringGuideModal } from './components/AuthoringGuideModal';

type AppScreen = 'home' | 'quiz' | 'results' | 'review';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [quizTitle, setQuizTitle] = useState('Interactive Quiz');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User responses
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerValue>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Attempt Results
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);

  // Elapsed Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Check URL path on mount for /help
  useEffect(() => {
    if (window.location.pathname === '/help' || window.location.hash === '#help') {
      setIsGuideOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle guide on '?' if not inside an input
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        setIsGuideOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleDownloadTemplate = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(BLANK_TEMPLATE_JSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'quiz_template.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleQuizLoaded = (data: { title: string; description: string; questions: QuizQuestion[] }) => {
    setQuizTitle(data.title);
    setQuizDescription(data.description);
    setQuestions(data.questions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setAttemptResult(null);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setScreen('quiz');
  };

  const handleAnswerChange = (questionId: string, val: UserAnswerValue) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleRequestSubmit = () => {
    setIsSummaryModalOpen(true);
  };

  const handleFinalSubmit = () => {
    setIsSummaryModalOpen(false);
    setIsTimerRunning(false);
    const result = scoreFullQuiz(questions, userAnswers);
    setAttemptResult(result);
    setScreen('results');
  };

  const handleReviewAnswers = (targetIndex: number = 0) => {
    setCurrentIndex(targetIndex);
    setScreen('review');
  };

  const handleRestartQuiz = () => {
    setIsTimerRunning(false);
    setScreen('home');
    setQuestions([]);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setAttemptResult(null);
    setElapsedSeconds(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header (hidden on home page where file is uploaded) */}
      {screen !== 'home' && (
        <Header
          quizTitle={quizTitle}
          onOpenGuide={() => setIsGuideOpen(true)}
          onResetQuiz={handleRestartQuiz}
          showReset={true}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {screen === 'home' && (
          <HomeView
            onQuizLoaded={handleQuizLoaded}
            onOpenGuide={() => setIsGuideOpen(true)}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}

        {screen === 'quiz' && (
          <QuizPlayView
            quizTitle={quizTitle}
            quizDescription={quizDescription}
            questions={questions}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onRequestSubmit={handleRequestSubmit}
            onRestartQuiz={handleRestartQuiz}
            elapsedSeconds={elapsedSeconds}
          />
        )}

        {screen === 'results' && attemptResult && (
          <ResultsView
            quizTitle={quizTitle}
            attemptResult={attemptResult}
            questions={questions}
            onReviewAnswers={handleReviewAnswers}
            onRestartQuiz={handleRestartQuiz}
            elapsedSeconds={elapsedSeconds}
          />
        )}

        {screen === 'review' && attemptResult && (
          <QuizPlayView
            quizTitle={quizTitle}
            quizDescription={quizDescription}
            questions={questions}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            userAnswers={userAnswers}
            onAnswerChange={() => {}}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={() => {}}
            onRequestSubmit={() => {}}
            isReview={true}
            attemptResult={attemptResult}
            onFinishReview={() => setScreen('results')}
            onRestartQuiz={handleRestartQuiz}
            elapsedSeconds={elapsedSeconds}
          />
        )}
      </main>

      {/* Summary of Attempt Confirmation Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        questions={questions}
        userAnswers={userAnswers}
        flaggedQuestions={flaggedQuestions}
        onJumpToQuestion={(idx) => {
          setCurrentIndex(idx);
          setIsSummaryModalOpen(false);
        }}
        onConfirmSubmit={handleFinalSubmit}
      />

      {/* Authoring Guide Modal */}
      <AuthoringGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {/* Persistent Footer with required credits and social links */}
      <Footer />
    </div>
  );
}
