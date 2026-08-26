/* eslint-disable @typescript-eslint/no-explicit-any -- `convert` adapts route
   modules whose exports are only known at runtime. */
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';

import { paths } from '@/config/paths';

/**
 * Adapts a lazily-imported route module to react-router's shape, handing the
 * `queryClient` to the module's `clientLoader`/`clientAction` factories so
 * routes can prefetch queries before navigation completes.
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

/**
 * Routes are split at the route level — the granularity where code splitting
 * pays for itself. Feature routes are added under `paths.app`.
 */
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);
