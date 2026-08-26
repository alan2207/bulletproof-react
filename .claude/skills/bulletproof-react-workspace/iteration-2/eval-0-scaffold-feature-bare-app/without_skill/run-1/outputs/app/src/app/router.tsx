import { createBrowserRouter, Navigate } from 'react-router';

import { MainLayout } from '@/components/layouts/main-layout';
import { paths } from '@/config/paths';

import { NotFoundRoute } from './routes/not-found';
import { RouteErrorBoundary } from './routes/route-error';

/**
 * One route entry per page. Page modules are loaded with `lazy` so each
 * feature ships in its own chunk — adding features doesn't grow the initial
 * bundle.
 */
export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <MainLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          index: true,
          element: <Navigate to={paths.tasks.getHref()} replace />,
        },
        {
          path: paths.tasks.path,
          lazy: async () => {
            const { TasksRoute } = await import('./routes/tasks/tasks');
            return { Component: TasksRoute };
          },
        },
        {
          path: '*',
          element: <NotFoundRoute />,
        },
      ],
    },
  ]);
