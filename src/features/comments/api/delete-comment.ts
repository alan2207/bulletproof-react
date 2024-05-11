import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

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
    mutationFn: deleteComment,
  });
};
