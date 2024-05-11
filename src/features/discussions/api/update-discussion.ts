import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { Discussion } from '../types';

import { getDiscussionKey } from './get-discussion';

export const updateDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export type UpdateDiscussionInput = z.infer<typeof updateDiscussionInputSchema>;

export const updateDiscussion = ({
  data,
  discussionId,
}: {
  data: UpdateDiscussionInput;
  discussionId: string;
}): Promise<Discussion> => {
  return api.patch(`/discussions/${discussionId}`, data);
};

type UseUpdateDiscussionOptions = {
  config?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({
  config,
}: UseUpdateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getDiscussionKey(data.id),
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateDiscussion,
  });
};
