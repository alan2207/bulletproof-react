import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, createBrowserRouter, useLocation } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { ProtectedRoute } from '@/lib/auth';

const MainApp = () => {
  const location = useLocation();
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary
          key={location.pathname}
          fallback={<div>Something went wrong!</div>}
        >
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    </DashboardLayout>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { LandingRoute } = await import('./landing');
      return { Component: LandingRoute };
    },
  },
  {
    path: '/auth/register',
    lazy: async () => {
      const { RegisterRoute } = await import('./auth/register');
      return { Component: RegisterRoute };
    },
  },
  {
    path: '/auth/login',
    lazy: async () => {
      const { LoginRoute } = await import('./auth/login');
      return { Component: LoginRoute };
    },
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainApp />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'discussions',
        lazy: async () => {
          const { DiscussionsRoute } = await import(
            '@/routes/app/discussions/discussions'
          );
          return { Component: DiscussionsRoute };
        },
      },
      {
        path: 'discussions/:discussionId',
        lazy: async () => {
          const { DiscussionRoute } = await import(
            '@/routes/app/discussions/discussion'
          );
          return { Component: DiscussionRoute };
        },
      },
      {
        path: 'users',
        lazy: async () => {
          const { UsersRoute } = await import('./app/users');
          return { Component: UsersRoute };
        },
      },
      {
        path: 'profile',
        lazy: async () => {
          const { ProfileRoute } = await import('./app/profile');
          return { Component: ProfileRoute };
        },
      },
      {
        path: '',
        lazy: async () => {
          const { DashboardRoute } = await import('./app/dashboard');
          return { Component: DashboardRoute };
        },
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundRoute } = await import('./not-found');
      return { Component: NotFoundRoute };
    },
  },
]);
