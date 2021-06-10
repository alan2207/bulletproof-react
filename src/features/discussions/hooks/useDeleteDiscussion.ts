import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '@/lib/react-query';

import { deleteDiscussion } from '../api';
import { Discussion } from '../types';

type UseDeleteDiscussionOptions = {
  config?: MutationConfig<typeof deleteDiscussion>;
};

export const useDeleteDiscussion = ({ config }: UseDeleteDiscussionOptions = {}) => {
  return useMutation({
    onMutate: async (deletedDiscussion) => {
      await queryClient.cancelQueries('discussions');

      const previousDiscussions = queryClient.getQueryData<Discussion[]>('discussions');

      queryClient.setQueryData(
        'discussions',
        previousDiscussions?.filter(
          (discussion) => discussion.id !== deletedDiscussion.discussionId
        )
      );

      return { previousDiscussions };
    },
    onError: (_, __, context: any) => {
      if (context?.previousDiscussions) {
        queryClient.setQueryData('discussions', context.previousDiscussions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries('discussions');
    },
    ...config,
    mutationFn: deleteDiscussion,
  });
};
