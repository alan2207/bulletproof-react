import { Outlet } from 'react-router';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';

const AppRoot = () => (
  <DashboardLayout>
    {/* Segment-level boundary: a broken page keeps the shell alive. */}
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Outlet />
    </ErrorBoundary>
  </DashboardLayout>
);

export default AppRoot;
