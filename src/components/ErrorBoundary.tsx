import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-rose-200 p-6 shadow-sm text-center">
            <h2 className="text-lg font-bold text-rose-700">Something went wrong</h2>
            <p className="text-sm text-slate-600 mt-2">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch (e) {
                  // ignore
                }
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
