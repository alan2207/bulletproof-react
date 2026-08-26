import { useRouteError } from 'react-router';

import { ErrorFallback } from '@/components/errors/error-fallback';

const toError = (value: unknown) =>
  value instanceof Error ? value : new Error('Unexpected routing error');

/** Rendered by the router when a route (or its lazy chunk) throws. */
export const RouteErrorBoundary = () => {
  const error = useRouteError();

  return (
    <ErrorFallback
      error={toError(error)}
      reset={() => window.location.reload()}
    />
  );
};
