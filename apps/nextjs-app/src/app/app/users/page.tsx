import { ContentLayout } from '@/components/layouts/content-layout';

import { Users } from './_components/users';

export const metadata = {
  title: 'Users',
  description: 'Users',
};

const UsersPage = () => {
  return (
    <ContentLayout title="Users">
      <Users />
    </ContentLayout>
  );
};

export default UsersPage;
