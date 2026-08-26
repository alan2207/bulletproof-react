import * as React from 'react';

/**
 * Minimal error boundary. Boundaries are meant to be placed at several seams
 * (app root, layout, per route) so one crashing subtree doesn't take the whole
 * app down — this component is the reusable piece for the non-route seams.
 *
 * Swap for `react-error-boundary` if that dependency is added later; the props
 * are intentionally the same shape.
 */
type ErrorBoundaryProps = {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error }>;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Replace with the error tracker (e.g. Sentry) once one is wired up.
    console.error(error, info);
  }

  render() {
    const { error } = this.state;
    const { FallbackComponent, children } = this.props;

    if (error) {
      return <FallbackComponent error={error} />;
    }

    return children;
  }
}
