import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussions = (): Promise<Discussion[]> => {
  return api.get('/discussions');
};

type QueryFnType = typeof getDiscussions;

export const getDiscussionsKey = () => ['discussions'];

type UseDiscussionsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDiscussions = ({ config }: UseDiscussionsOptions = {}) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: getDiscussionsKey(),
    queryFn: () => getDiscussions(),
  });
};
