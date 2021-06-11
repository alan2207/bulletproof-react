import { ContentLayout } from '@/components/Layout';
import { useAuth } from '@/lib/auth';

export const Dashboard = () => {
  const { user } = useAuth();
  return (
    <ContentLayout title={`Welcome ${user?.firstName} ${user?.lastName}`}>
      <div>Dashboard</div>
    </ContentLayout>
  );
};
