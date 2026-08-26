import { Component, type ComponentType, type ReactNode } from 'react';

type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  FallbackComponent: ComponentType<FallbackProps>;
  onError?: (error: Error) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Catches render-time errors so one broken feature cannot blank the whole
 * app. Wrap individual features with this too, not just the root.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Replace with the app's error reporting client (Sentry, etc.).
    console.error(error);
    this.props.onError?.(error);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { FallbackComponent, children } = this.props;

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

export type { FallbackProps };
