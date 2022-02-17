import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussions = (): Promise<Discussion[]> => {
  return axios.get('/discussions');
};

type QueryFnType = typeof getDiscussions;

type UseDiscussionsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useDiscussions = ({ config }: UseDiscussionsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['discussions'],
    queryFn: () => getDiscussions(),
  });
};
