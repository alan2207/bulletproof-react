import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { ErrorFallback } from '@/components/errors/error-fallback';
import { createQueryClient } from '@/lib/react-query';

type AppProviderProps = {
  children: ReactNode;
};

/**
 * Every app-wide provider lives here, in one place. Tests can render a subtree
 * with the same wrapper instead of duplicating setup.
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  // Created once per app instance (never at module scope, so tests get a
  // fresh cache).
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <ErrorFallback error={error} reset={reset} />
      )}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  );
};
