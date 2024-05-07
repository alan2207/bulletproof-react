import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { Comment } from '../types';

import { getCommentsKey } from './get-comments';

export const deleteComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comments/${commentId}`);
};

type UseDeleteCommentOptions = {
  discussionId: string;
  config?: MutationConfig<typeof deleteComment>;
};

export const useDeleteComment = ({
  config,
  discussionId,
}: UseDeleteCommentOptions) => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (deletedComment) => {
      await queryClient.cancelQueries({
        queryKey: getCommentsKey(discussionId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        'comments',
        discussionId,
      ]);

      queryClient.setQueryData(
        getCommentsKey(discussionId),
        previousComments?.filter(
          (comment) => comment.id !== deletedComment.commentId,
        ),
      );

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
        title: 'Comment Deleted',
      });
    },
    ...config,
    mutationFn: deleteComment,
  });
};
