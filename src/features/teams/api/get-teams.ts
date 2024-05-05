import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Team } from '../types';

export const getTeams = (): Promise<Team[]> => {
  return axios.get('/teams');
};

type QueryFnType = typeof getTeams;

type UseTeamsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useTeams = ({ config = {} }: UseTeamsOptions = {}) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });
};
