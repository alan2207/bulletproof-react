import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: (props: { error: Error; reset: () => void }) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Catches render-time crashes so a single broken component does not blank the
 * whole page.
 *
 * It cannot catch errors thrown while modules are being evaluated (a bad env
 * config, for instance) — React is not running yet at that point. `main.tsx`
 * handles that case separately.
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
    // Swap for your error reporter (Sentry, Datadog, ...) when one is wired up.
    console.error('Uncaught error:', error, errorInfo.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) return this.props.fallback({ error, reset: this.reset });

    return this.props.children;
  }
}
