import { ReactNode } from 'react';

import { DashboardLayout } from './_components/dashboard-layout';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AppLayout;
