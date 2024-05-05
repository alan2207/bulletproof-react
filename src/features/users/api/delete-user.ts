import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { User } from '../types';

export type DeleteUserDTO = {
  userId: string;
};

export const deleteUser = ({ userId }: DeleteUserDTO) => {
  return axios.delete(`/users/${userId}`);
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
        queryKey: ['users'],
      });

      const previousUsers = queryClient.getQueryData<User[]>(['users']);

      queryClient.setQueryData(
        ['users'],
        previousUsers?.filter((user) => user.id !== deletedUser.userId)
      );

      return { previousUsers };
    },
    onError: (_, __, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
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
