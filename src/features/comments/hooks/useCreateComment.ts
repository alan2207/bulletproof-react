import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { createComment } from '../api';

type UseCreateCommentOptions = {
  config?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({ config }: UseCreateCommentOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: createComment,
  });
};
