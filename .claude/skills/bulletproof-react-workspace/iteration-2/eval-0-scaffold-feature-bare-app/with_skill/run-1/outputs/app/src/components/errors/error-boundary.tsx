import { Component, ComponentType, ErrorInfo, ReactNode } from 'react';

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  FallbackComponent: ComponentType<ErrorFallbackProps>;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Minimal local error boundary (stands in for `react-error-boundary`). Use one
 * per segment — a failing widget should not blank the whole page.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Replace with the app's error reporter (Sentry, etc.).
    console.error(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, FallbackComponent } = this.props;

    if (error) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}
