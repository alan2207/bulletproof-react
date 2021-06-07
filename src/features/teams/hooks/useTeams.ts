import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getTeams } from '../api';

type UseTeamsOptions = {
  config?: QueryConfig<typeof getTeams>;
};

export const useTeams = ({ config = {} }: UseTeamsOptions = {}) => {
  return useQuery({
    ...config,
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });
};
