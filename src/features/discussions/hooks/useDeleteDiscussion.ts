import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { deleteDiscussion } from '../api';

type UseDeleteDiscussionOptions = {
  config?: MutationConfig<typeof deleteDiscussion>;
};

export const useDeleteDiscussion = ({ config }: UseDeleteDiscussionOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteDiscussion,
  });
};
