import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Task } from '@/types/api';

export const getTasks = (): Promise<Task[]> => {
  return api.get('/tasks');
};

/**
 * Exported separately from the hook so route loaders can prefetch and mutations
 * can invalidate with `getTasksQueryOptions().queryKey` — the key is defined
 * here and nowhere else.
 */
export const getTasksQueryOptions = () => {
  return queryOptions({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  });
};

type UseTasksOptions = {
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

export const useTasks = ({ queryConfig }: UseTasksOptions = {}) => {
  return useQuery({
    ...getTasksQueryOptions(),
    ...queryConfig,
  });
};
