import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider } from 'react-router';

import { AppProvider } from './provider';
import { createAppRouter } from './router';

const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};

export const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
);
