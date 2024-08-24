import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Discussion } from '@/types/api';

import { getDiscussionsQueryOptions } from './get-discussions';

export const createDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
  public: z.boolean(),
});

export type CreateDiscussionInput = z.infer<typeof createDiscussionInputSchema>;

export const createDiscussion = ({
  data,
}: {
  data: CreateDiscussionInput;
}): Promise<Discussion> => {
  return api.post(`/discussions`, data);
};

type UseCreateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({
  mutationConfig,
}: UseCreateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createDiscussion,
  });
};
