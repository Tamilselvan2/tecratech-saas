'use client';

import React from 'react';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white dark:bg-slate-950 border border-border rounded-3xl shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong.</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Reload the page or try again later.</p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
