import { useMutation } from 'react-query';

import { deleteUser } from '../api';

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
