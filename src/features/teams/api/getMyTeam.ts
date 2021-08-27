import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';

import { Team } from '../types';

export const getMyTeam = (): Promise<Team> => {
  return axios.get('/team');
};

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
