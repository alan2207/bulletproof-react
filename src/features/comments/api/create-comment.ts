import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

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
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: getCommentsKey(discussionId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        'comments',
        discussionId,
      ]);

      queryClient.setQueryData(getCommentsKey(discussionId), [
        ...(previousComments || []),
        newComment.data,
      ]);

      return { previousComments };
    },
    onError: (_, __, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          getCommentsKey(discussionId),
          context.previousComments,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCommentsKey(discussionId),
      });
      addNotification({
        type: 'success',
        title: 'Comment Created',
      });
    },
    ...config,
    mutationFn: createComment,
  });
};
