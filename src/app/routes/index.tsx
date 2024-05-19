import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from '@/lib/auth';

import { discussionLoader } from './app/discussions/discussion';
import { discussionsLoader } from './app/discussions/discussions';
import { AppRoot } from './app/root';
import { usersLoader } from './app/users';

export const createRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
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
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'discussions',
          lazy: async () => {
            const { DiscussionsRoute } = await import(
              './app/discussions/discussions'
            );
            return { Component: DiscussionsRoute };
          },
          loader: discussionsLoader(queryClient),
        },
        {
          path: 'discussions/:discussionId',
          lazy: async () => {
            const { DiscussionRoute } = await import(
              './app/discussions/discussion'
            );
            return { Component: DiscussionRoute };
          },
          loader: discussionLoader(queryClient),
        },
        {
          path: 'users',
          lazy: async () => {
            const { UsersRoute } = await import('./app/users');
            return { Component: UsersRoute };
          },
          loader: usersLoader(queryClient),
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
