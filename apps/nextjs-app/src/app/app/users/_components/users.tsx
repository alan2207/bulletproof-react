import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getUsersQueryOptions } from '@/features/users/api/get-users';
import { UsersList } from '@/features/users/components/users-list';
import { getUser } from '@/lib/auth';
import { canViewUsers } from '@/lib/authorization';

export const Users = async () => {
  const user = await getUser();

  if (!canViewUsers(user)) {
    return <div>Only admin can view this.</div>;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getUsersQueryOptions());

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersList />
    </HydrationBoundary>
  );
};
