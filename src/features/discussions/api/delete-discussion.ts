import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { Discussion } from '../types';

import { getDiscussionsKey } from './get-discussions';

export const deleteDiscussion = ({
  discussionId,
}: {
  discussionId: string;
}) => {
  return api.delete(`/discussions/${discussionId}`);
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
        queryKey: getDiscussionsKey(),
      });

      const previousDiscussions =
        queryClient.getQueryData<Discussion[]>(getDiscussionsKey());

      queryClient.setQueryData(
        getDiscussionsKey(),
        previousDiscussions?.filter(
          (discussion) => discussion.id !== deletedDiscussion.discussionId,
        ),
      );

      return { previousDiscussions };
    },
    onError: (_, __, context: any) => {
      if (context?.previousDiscussions) {
        queryClient.setQueryData(
          getDiscussionsKey(),
          context.previousDiscussions,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsKey(),
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
