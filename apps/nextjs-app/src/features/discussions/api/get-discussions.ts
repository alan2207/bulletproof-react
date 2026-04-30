import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Discussion, Meta } from '@/types/api';

export const getDiscussions = (
  { page }: { page?: number } = { page: 1 },
): Promise<{
  data: Discussion[];
  meta: Meta;
}> => {
  return api.get(`/discussions`, {
    params: {
      page,
    },
  });
};

export const getDiscussionsQueryOptions = ({
  page = 1,
}: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ['discussions', { page }],
    queryFn: () => getDiscussions({ page }),
  });
};

type UseDiscussionsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

export const useDiscussions = ({
  queryConfig,
  page,
}: UseDiscussionsOptions) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    ...queryConfig,
  });
};
