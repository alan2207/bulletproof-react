import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '@/lib/react-query';

import { createDiscussion } from '../api';
import { Discussion } from '../types';

type UseCreateDiscussionOptions = {
  config?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({ config }: UseCreateDiscussionOptions = {}) => {
  return useMutation({
    onMutate: async (newDiscussion) => {
      await queryClient.cancelQueries('discussions');

      const previousDiscussions = queryClient.getQueryData<Discussion[]>('discussions');

      queryClient.setQueryData('discussions', [...(previousDiscussions || []), newDiscussion.data]);

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
    mutationFn: createDiscussion,
  });
};
