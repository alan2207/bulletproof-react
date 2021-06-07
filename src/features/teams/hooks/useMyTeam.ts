import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getMyTeam } from '../api';

type UseMyTeamOptions = {
  config?: QueryConfig<typeof getMyTeam>;
};

export const useMyTeam = ({ config }: UseMyTeamOptions = {}) => {
  return useQuery({
    ...config,
    queryKey: ['my-teams'],
    queryFn: () => getMyTeam(),
  });
};
