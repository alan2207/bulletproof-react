import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { User } from '../types';

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
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (deletedUser) => {
      await queryClient.cancelQueries({
        queryKey: getUsersKey(),
      });

      const previousUsers = queryClient.getQueryData<User[]>(getUsersKey());

      queryClient.setQueryData(
        getUsersKey(),
        previousUsers?.filter((user) => user.id !== deletedUser.userId),
      );

      return { previousUsers };
    },
    onError: (_, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(getUsersKey(), context.previousUsers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUsersKey(),
      });
      addNotification({
        type: 'success',
        title: 'User Deleted',
      });
    },
    ...config,
    mutationFn: deleteUser,
  });
};
