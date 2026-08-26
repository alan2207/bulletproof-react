import { createBrowserRouter, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { Home } from './routes/home';
import { Login } from './routes/login';
import { NotFound } from './routes/not-found';
import { RootErrorBoundary, RootLayout } from './routes/root';

const router = createBrowserRouter([
  {
    path: paths.home.path,
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: paths.auth.login.path, element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
