import { createBrowserRouter, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { HomeRoute } from './routes/home';
import { LoginRoute } from './routes/login';
import { NotFoundRoute } from './routes/not-found';

/**
 * The route table. Paths come from `@/config/paths` so that code outside the
 * router — the 401 handler in the API client, for example — can link to a route
 * without hardcoding its URL.
 */
const router = createBrowserRouter([
  {
    path: paths.home.path,
    element: <HomeRoute />,
  },
  {
    path: paths.auth.login.path,
    element: <LoginRoute />,
  },
  {
    path: '*',
    element: <NotFoundRoute />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
