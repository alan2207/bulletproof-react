import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';

import { tasksSchema, type Task } from '../types';
import { taskKeys } from './query-keys';

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks');
  // Validate at the boundary: nothing downstream has to defend against a
  // payload that doesn't match the contract.
  return tasksSchema.parse(response.data);
};

export const getTasksQueryOptions = () =>
  queryOptions({
    queryKey: taskKeys.lists(),
    queryFn: getTasks,
  });

type UseTasksOptions = {
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

export const useTasks = ({ queryConfig }: UseTasksOptions = {}) =>
  useQuery({
    ...getTasksQueryOptions(),
    ...queryConfig,
  });
