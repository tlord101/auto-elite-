import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected application error.'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Application runtime error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Runtime Error</p>
          <h1 className="text-2xl font-black text-slate-900">The app encountered an issue loading this page.</h1>
          <p className="text-sm text-slate-600 font-medium">
            Please refresh the page. If the issue persists, clear site data or contact support with the error below.
          </p>
          <pre className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto text-slate-700">
            {this.state.errorMessage}
          </pre>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
