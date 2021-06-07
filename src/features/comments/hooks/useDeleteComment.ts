import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { deleteComment } from '../api';

type UseDeleteComment = {
  config?: MutationConfig<typeof deleteComment>;
};

export const useDeleteComment = ({ config }: UseDeleteComment = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteComment,
  });
};
