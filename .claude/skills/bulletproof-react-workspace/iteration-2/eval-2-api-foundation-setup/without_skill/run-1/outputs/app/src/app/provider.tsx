import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState, type ReactNode } from 'react';

import { Notifications } from '@/components/ui/notifications';
import { createQueryClient } from '@/lib/react-query';

/**
 * Every app-wide provider, in one place. Anything the whole tree needs -
 * data fetching, notifications, and later theming or auth - is wired here so
 * `main.tsx` stays a two-line entry point.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // `useState` with an initialiser, not a module-level singleton: the client is
  // created once per mount, which keeps tests (and future StrictMode/HMR
  // remounts) from sharing a cache across app instances.
  const [queryClient] = useState(createQueryClient);

  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </Suspense>
  );
};
