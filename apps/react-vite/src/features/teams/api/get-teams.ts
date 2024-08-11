import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Team } from '@/types/api';

export const getTeams = (): Promise<{ data: Team[] }> => {
  return api.get('/teams');
};

export const getTeamsQueryOptions = () => {
  return queryOptions({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });
};

type UseTeamsOptions = {
  queryConfig?: QueryConfig<typeof getTeamsQueryOptions>;
};

export const useTeams = ({ queryConfig = {} }: UseTeamsOptions = {}) => {
  return useQuery({
    ...getTeamsQueryOptions(),
    ...queryConfig,
  });
};
