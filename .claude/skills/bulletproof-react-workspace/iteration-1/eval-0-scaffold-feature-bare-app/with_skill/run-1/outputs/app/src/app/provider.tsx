import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications/notifications';
import { Spinner } from '@/components/ui/spinner/spinner';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // Initializer form: the client is created once, not on every render.
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="screen-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary fallback={<MainErrorFallback />}>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
