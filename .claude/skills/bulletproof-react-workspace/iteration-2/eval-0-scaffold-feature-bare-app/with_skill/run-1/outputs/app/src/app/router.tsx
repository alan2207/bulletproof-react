import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, Navigate } from 'react-router';

import { paths } from '@/config/paths';

/**
 * Adapts a lazily-imported route module to a react-router route object,
 * handing the shared `queryClient` to its loader/action factories.
 */
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
      lazy: () => import('./routes/app/root').then(convert(queryClient)),
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
