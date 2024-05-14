import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussions = (): Promise<Discussion[]> => {
  return api.get('/discussions');
};

export const getDiscussionsQueryOptions = () => {
  return queryOptions({
    queryKey: ['discussions'],
    queryFn: () => getDiscussions(),
  });
};

type UseDiscussionsOptions = {
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

export const useDiscussions = ({ queryConfig }: UseDiscussionsOptions = {}) => {
  return useQuery({
    ...getDiscussionsQueryOptions(),
    ...queryConfig,
  });
};
