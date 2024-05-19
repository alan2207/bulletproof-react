import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { getUsersQueryOptions } from '@/features/users/api/get-users';
import { UsersList } from '@/features/users/components/users-list';
import { Authorization, ROLES } from '@/lib/authorization';

export const usersLoader = (queryClient: QueryClient) => async () => {
  const query = getUsersQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

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
