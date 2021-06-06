import { useMutation } from 'react-query';

import { deleteDiscussion } from '../api';

export const useDeleteDiscussion = () => {
  return useMutation({
    mutationFn: deleteDiscussion,
  });
};
