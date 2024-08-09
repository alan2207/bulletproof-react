import { QueryClient } from '@tanstack/react-query';

import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';

export const discussionsLoader = (queryClient: QueryClient) => async () => {
  const query = getDiscussionsQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
