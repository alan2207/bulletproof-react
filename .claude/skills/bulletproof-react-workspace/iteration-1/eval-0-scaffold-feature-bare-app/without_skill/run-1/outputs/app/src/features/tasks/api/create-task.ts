import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { getTasksQueryOptions } from './get-tasks';
import { taskSchema, type Task } from '../types/task';

/**
 * Validates the create-task form *and* types the POST body - one schema,
 * so the form can never submit a payload the API would reject.
 */
export const createTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or fewer'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = async ({
  data,
}: {
  data: CreateTaskInput;
}): Promise<Task> => {
  const response = await api.post<unknown>('/tasks', data);
  return taskSchema.parse(response);
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
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTasksQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    mutationFn: createTask,
  });
};
