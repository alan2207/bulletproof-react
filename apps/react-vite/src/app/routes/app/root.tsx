import { Outlet } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts';

export const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export const AppRootErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};
