import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '@/lib/react-query';

import { createComment } from '../api';

type UseCreateCommentOptions = {
  discussionId: string;
  config?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({ config, discussionId }: UseCreateCommentOptions) => {
  return useMutation({
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(['comments', discussionId]);

      const previousComments = queryClient.getQueryData<Comment[]>(['comments', discussionId]);

      queryClient.setQueryData(
        ['comments', discussionId],
        [...(previousComments || []), newComment.data]
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
    },
    ...config,
    mutationFn: createComment,
  });
};
