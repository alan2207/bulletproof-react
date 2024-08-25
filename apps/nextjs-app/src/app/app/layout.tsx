import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/layouts';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
