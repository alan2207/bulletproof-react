import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { createDiscussion } from '../api';

type UseCreateDiscussionOptions = {
  config?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({ config }: UseCreateDiscussionOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: createDiscussion,
  });
};
