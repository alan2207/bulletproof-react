import { useMutation } from 'react-query';

import { createDiscussion } from '../api';

export const useCreateDiscussion = () => {
  return useMutation({
    mutationFn: createDiscussion,
  });
};
