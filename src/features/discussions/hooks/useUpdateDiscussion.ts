import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '@/lib/react-query';

import { updateDiscussion } from '../api';

type UseUpdateDiscussionOptions = {
  config?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({ config }: UseUpdateDiscussionOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: updateDiscussion,
    onSuccess: (data) => {
      queryClient.refetchQueries(['discussion', data.id]);
    },
  });
};
