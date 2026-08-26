import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';

import { RouteError } from '@/components/errors/route-error';
import { MainLayout } from '@/components/layouts/main-layout';
import { paths } from '@/config/paths';

/**
 * Routes are code-split with `lazy`, so a new feature adds to the bundle
 * only for the people who visit it. The query client is threaded in so
 * loaders can prefetch into the same cache the components read from.
 */
const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <MainLayout />,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          element: <Navigate to={paths.tasks.getHref()} replace />,
        },
        {
          path: paths.tasks.path,
          lazy: async () => {
            const { TasksRoute, tasksLoader } = await import(
              '@/app/routes/tasks'
            );
            return { Component: TasksRoute, loader: tasksLoader(queryClient) };
          },
          errorElement: <RouteError />,
        },
        {
          path: paths.notFound.path,
          lazy: async () => {
            const { NotFoundRoute } = await import('@/app/routes/not-found');
            return { Component: NotFoundRoute };
          },
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
