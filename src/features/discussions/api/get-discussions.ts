import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussions = (): Promise<Discussion[]> => {
  return api.get('/discussions');
};

type QueryFnType = typeof getDiscussions;

type UseDiscussionsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDiscussions = ({ config }: UseDiscussionsOptions = {}) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['discussions'],
    queryFn: () => getDiscussions(),
  });
};
