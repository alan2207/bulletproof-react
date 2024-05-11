import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getUsersKey } from './get-users';

export type DeleteUserDTO = {
  userId: string;
};

export const deleteUser = ({ userId }: DeleteUserDTO) => {
  return api.delete(`/users/${userId}`);
};

type UseDeleteUserOptions = {
  config?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ config }: UseDeleteUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersKey(),
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUser,
  });
};
