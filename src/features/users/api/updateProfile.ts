import { useMutation } from 'react-query';

import { useAuth } from '@/lib/auth';
import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

export type UpdateProfileDTO = {
  data: {
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
  };
};

export const updateProfile = ({ data }: UpdateProfileDTO) => {
  return axios.patch(`/users/profile`, data);
};

type UseUpdateProfileOptions = {
  config?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ config }: UseUpdateProfileOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const { refetchUser } = useAuth();
  return useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'User Updated',
      });
      refetchUser();
    },
    ...config,
    mutationFn: updateProfile,
  });
};
