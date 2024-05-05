import { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { ProtectedRoute } from '@/features/auth';
import { lazyImport } from '@/utils/lazyImport';

const { DashboardRoute } = lazyImport(() => import('@/features/misc'), 'DashboardRoute');
const { ProfileRoute } = lazyImport(() => import('@/features/users'), 'ProfileRoute');
const { UsersRoute } = lazyImport(() => import('@/features/users'), 'UsersRoute');
const { RegisterRoute } = lazyImport(() => import('@/features/auth'), 'RegisterRoute');
const { LoginRoute } = lazyImport(() => import('@/features/auth'), 'LoginRoute');
const { DiscussionRoute } = lazyImport(() => import('@/features/discussions'), 'DiscussionRoute');
const { DiscussionsRoute } = lazyImport(() => import('@/features/discussions'), 'DiscussionsRoute');
const { LandingRoute } = lazyImport(() => import('@/features/misc'), 'LandingRoute');
const { NotFoundRoute } = lazyImport(() => import('@/features/misc'), 'NotFoundRoute');

const MainApp = () => {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/auth/register" element={<RegisterRoute />} />
      <Route path="/auth/login" element={<LoginRoute />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      >
        <Route path="/app/discussions" element={<DiscussionsRoute />} />
        <Route path="/app/discussions/:discussionId" element={<DiscussionRoute />} />
        <Route path="/app/users" element={<UsersRoute />} />
        <Route path="/app/profile" element={<ProfileRoute />} />
        <Route path="/app/" element={<DashboardRoute />} />
      </Route>
      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  );
};
