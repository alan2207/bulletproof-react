import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/layouts';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AppLayout;
