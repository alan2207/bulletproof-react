import { QueryClient, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { AppRoot } from './routes/app/root';

/**
 * Adapts a lazily-imported route module to react-router's shape: the module
 * exports `clientLoader`/`clientAction` FACTORIES that take the queryClient,
 * so loaders can prefetch through react-query.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      children: [
        {
          index: true,
          element: <Navigate to={paths.app.tasks.getHref()} replace />,
        },
        {
          path: paths.app.tasks.path,
          lazy: () =>
            import('./routes/app/tasks/tasks').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = React.useMemo(
    () => createAppRouter(queryClient),
    [queryClient],
  );

  return <RouterProvider router={router} />;
};
