import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

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
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsKey(),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteDiscussion,
  });
};
