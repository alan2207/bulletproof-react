import { useMutation } from 'react-query';

import { createComment } from '../api';

export const useCreateComment = () => {
  return useMutation({
    mutationFn: createComment,
  });
};
