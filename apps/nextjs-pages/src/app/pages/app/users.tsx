import { ReactElement } from 'react';

import { ContentLayout, DashboardLayout } from '@/components/layouts';
import { UsersList } from '@/features/users/components/users-list';
import { Authorization, ROLES } from '@/lib/authorization';

export const UsersPage = () => {
  return (
    <ContentLayout title="Users">
      <Authorization
        forbiddenFallback={<div>Only admin can view this.</div>}
        allowedRoles={[ROLES.ADMIN]}
      >
        <UsersList />
      </Authorization>
    </ContentLayout>
  );
};

UsersPage.getLayout = (page: ReactElement) => {
  return (
    <DashboardLayout>
      <ContentLayout title="Users">{page}</ContentLayout>
    </DashboardLayout>
  );
};
