import { useMutation } from 'react-query';

import { deleteComment } from '../api';

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: deleteComment,
  });
};
