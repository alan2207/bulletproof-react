import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

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
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (updatingDiscussion) => {
      await queryClient.cancelQueries({
        queryKey: getDiscussionKey(updatingDiscussion.discussionId),
      });

      const previousDiscussion = queryClient.getQueryData<Discussion>([
        'discussion',
        updatingDiscussion?.discussionId,
      ]);

      queryClient.setQueryData(
        getDiscussionKey(updatingDiscussion.discussionId),
        {
          ...previousDiscussion,
          ...updatingDiscussion.data,
          id: updatingDiscussion.discussionId,
        },
      );

      return { previousDiscussion };
    },
    onError: (_, __, context: any) => {
      if (context?.previousDiscussion) {
        queryClient.setQueryData(
          getDiscussionKey(context.previousDiscussion.id),
          context.previousDiscussion,
        );
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: getDiscussionKey(data.id),
      });
      addNotification({
        type: 'success',
        title: 'Discussion Updated',
      });
    },
    ...config,
    mutationFn: updateDiscussion,
  });
};
