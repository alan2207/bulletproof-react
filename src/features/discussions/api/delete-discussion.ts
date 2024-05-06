import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { Discussion } from '../types';

export const deleteDiscussion = ({
  discussionId,
}: {
  discussionId: string;
}) => {
  return axios.delete(`/discussions/${discussionId}`);
};

type UseDeleteDiscussionOptions = {
  config?: MutationConfig<typeof deleteDiscussion>;
};

export const useDeleteDiscussion = ({
  config,
}: UseDeleteDiscussionOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (deletedDiscussion) => {
      await queryClient.cancelQueries({
        queryKey: ['discussions'],
      });

      const previousDiscussions = queryClient.getQueryData<Discussion[]>([
        'discussions',
      ]);

      queryClient.setQueryData(
        ['discussions'],
        previousDiscussions?.filter(
          (discussion) => discussion.id !== deletedDiscussion.discussionId,
        ),
      );

      return { previousDiscussions };
    },
    onError: (_, __, context: any) => {
      if (context?.previousDiscussions) {
        queryClient.setQueryData(['discussions'], context.previousDiscussions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['discussions'],
      });
      addNotification({
        type: 'success',
        title: 'Discussion Deleted',
      });
    },
    ...config,
    mutationFn: deleteDiscussion,
  });
};
