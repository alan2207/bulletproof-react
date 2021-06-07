import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { deleteUser } from '../api';

type UseDeleteUserOptions = {
  config?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ config }: UseDeleteUserOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteUser,
  });
};
