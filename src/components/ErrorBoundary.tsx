import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level React Error Boundary.
 *
 * Catches any unhandled render/lifecycle errors from the component tree below
 * and presents a recoverable fallback UI instead of silently crashing.
 * This prevents blank screens and improves perceived reliability.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real deployment this would be sent to a monitoring service (e.g. Sentry).
    console.error('[ErrorBoundary] Unhandled render error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
        >
          <span className="text-5xl mb-4" aria-hidden="true">⚠️</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            An unexpected error occurred while rendering this page.
            You can try refreshing, or return to the home page.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-[var(--color-teal)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-amber-400"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-400"
            >
              Go to home
            </a>
          </div>
          {this.state.error && (
            <details className="mt-6 text-xs text-gray-400 max-w-lg text-left">
              <summary className="cursor-pointer hover:text-gray-600">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">{this.state.error.message}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
