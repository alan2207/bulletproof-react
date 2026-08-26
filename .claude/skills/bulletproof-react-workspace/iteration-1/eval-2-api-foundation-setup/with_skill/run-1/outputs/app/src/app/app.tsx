import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { RouterProvider } from 'react-router';

import { AppProvider } from './provider';
import { createAppRouter } from './router';

const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = React.useMemo(
    () => createAppRouter(queryClient),
    [queryClient],
  );

  return <RouterProvider router={router} />;
};

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
