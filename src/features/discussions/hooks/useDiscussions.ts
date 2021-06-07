import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getDiscussions } from '../api';

type UseDiscussionsOptions = {
  config?: QueryConfig<typeof getDiscussions>;
};

export const useDiscussions = ({ config }: UseDiscussionsOptions = {}) => {
  return useQuery({
    ...config,
    queryKey: ['discussions'],
    queryFn: () => getDiscussions(),
  });
};
