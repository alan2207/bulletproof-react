import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import { taskSchema, type Task } from '../types/task';

export const getTasks = async (): Promise<Task[]> => {
  const data = await api.get<unknown>('/tasks');
  return z.array(taskSchema).parse(data);
};

/**
 * Exported separately from the hook so route loaders can prefetch the same
 * query with the same key.
 */
export const getTasksQueryOptions = () =>
  queryOptions({
    queryKey: ['tasks'] as const,
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
