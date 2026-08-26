import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main-error-fallback';
import { Spinner } from '@/components/ui/spinner/spinner';
import { queryConfig } from '@/lib/react-query';

/**
 * Every app-wide provider lives here, so `app/router.tsx` and the feature
 * code below it never need to know what is wired at the root.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <Suspense
      fallback={
        <div className="center center--screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
