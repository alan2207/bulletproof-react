import * as React from 'react';

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
  fallback: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Contains a render error to its subtree. Place several of these at meaningful
 * seams (app root, layout, route) rather than relying on a single global one —
 * a crash in one route should leave the rest of the app usable.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Hook up Sentry (or similar) here — don't build a custom error reporter.
    this.props.onError?.(error, info);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      const Fallback = this.props.fallback;
      return (
        <Fallback error={error} resetErrorBoundary={this.resetErrorBoundary} />
      );
    }

    return this.props.children;
  }
}
