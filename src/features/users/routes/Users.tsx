import { ContentLayout } from '@/components/Layout';

import { UsersList } from '../components/UsersList';

export const Users = () => {
  return (
    <ContentLayout title="Users">
      <div className="mt-4">
        <UsersList />
      </div>
    </ContentLayout>
  );
};
