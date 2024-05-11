import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { Comment } from '../types';

import { getCommentsKey } from './get-comments';

export const createCommentInputSchema = z.object({
  discussionId: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

export const createComment = ({
  data,
}: {
  data: CreateCommentInput;
}): Promise<Comment> => {
  return api.post('/comments', data);
};

type UseCreateCommentOptions = {
  discussionId: string;
  config?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({
  config,
  discussionId,
}: UseCreateCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommentsKey(discussionId),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createComment,
  });
};
