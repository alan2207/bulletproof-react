import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import {
  createTaskInputSchema,
  taskSchema,
  type CreateTaskInput,
  type Task,
} from '../types';
import { taskKeys } from './query-keys';

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const payload = createTaskInputSchema.parse(data);
  const response = await apiClient.post('/tasks', payload);
  return taskSchema.parse(response.data);
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({
  mutationConfig,
}: UseCreateTaskOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createTask,
    onSuccess: (...args) => {
      // Cache invalidation is the hook's job, not the caller's.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
