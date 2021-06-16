import { useMutation } from 'react-query';

import { useNotificationStore } from '@/hooks/useNotificationStore';
import { MutationConfig, queryClient } from '@/lib/react-query';

import { deleteComment } from '../api';
import { Comment } from '../types';

type UseDeleteComment = {
  discussionId: string;
  config?: MutationConfig<typeof deleteComment>;
};

export const useDeleteComment = ({ config, discussionId }: UseDeleteComment) => {
  const { addNotification } = useNotificationStore();
  return useMutation({
    onMutate: async (deletedComment) => {
      await queryClient.cancelQueries(['comments', discussionId]);

      const previousComments = queryClient.getQueryData<Comment[]>(['comments', discussionId]);

      queryClient.setQueryData(
        ['comments', discussionId],
        previousComments?.filter((comment) => comment.id !== deletedComment.commentId)
      );

      return { previousComments };
    },
    onError: (_, __, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', discussionId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['comments', discussionId]);
      addNotification({
        type: 'success',
        title: 'Comment Deleted',
      });
    },
    ...config,
    mutationFn: deleteComment,
  });
};
