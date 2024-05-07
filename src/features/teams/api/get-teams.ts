import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Team } from '../types';

export const getTeams = (): Promise<Team[]> => {
  return api.get('/teams');
};

type QueryFnType = typeof getTeams;

export const getTeamsKey = () => ['teams'];

type UseTeamsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useTeams = ({ config = {} }: UseTeamsOptions = {}) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: getTeamsKey(),
    queryFn: () => getTeams(),
  });
};
