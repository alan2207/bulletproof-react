import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main-error-fallback';
import { Notifications } from '@/components/ui/notifications/notifications';
import { queryClient } from '@/lib/react-query';

/**
 * Everything the whole tree needs, in the order it needs it.
 *
 * `Notifications` sits outside the boundary and the suspense fence on purpose:
 * a message about a failed request should still be visible while the app is
 * loading, and after it has crashed.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => (
  <>
    <Notifications />
    <Suspense fallback={null}>
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <MainErrorFallback error={error} reset={reset} />
        )}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  </>
);
