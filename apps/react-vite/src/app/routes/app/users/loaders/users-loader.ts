import { QueryClient } from '@tanstack/react-query';

import { getUsersQueryOptions } from '@/features/users/api/get-users';

export const usersLoader = (queryClient: QueryClient) => async () => {
  const query = getUsersQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
