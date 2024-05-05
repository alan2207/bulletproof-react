import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { Comment } from '../types';

export type CreateCommentDTO = {
  data: {
    body: string;
    discussionId: string;
  };
};

export const createComment = ({ data }: CreateCommentDTO): Promise<Comment> => {
  return axios.post('/comments', data);
};

type UseCreateCommentOptions = {
  discussionId: string;
  config?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({ config, discussionId }: UseCreateCommentOptions) => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ['comments', discussionId],
      });

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', discussionId],
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
