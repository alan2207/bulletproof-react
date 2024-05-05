import { ContentLayout } from '@/components/layouts';
import { Authorization, ROLES } from '@/features/auth';

import { UsersList } from '../components/UsersList';

export const UsersRoute = () => {
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
