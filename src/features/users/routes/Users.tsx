import { ContentLayout } from '@/components/Layout';
import { RBAC, ROLES } from '@/lib/rbac';

import { UsersList } from '../components/UsersList';

export const Users = () => {
  return (
    <ContentLayout title="Users">
      <div className="mt-4">
        <RBAC forbiddenFallback={<div>Only admin can view this.</div>} allowedRoles={[ROLES.ADMIN]}>
          <UsersList />
        </RBAC>
      </div>
    </ContentLayout>
  );
};
