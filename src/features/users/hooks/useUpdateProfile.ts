import { useMutation } from 'react-query';

import { useNotificationStore } from '@/hooks/useNotificationStore';
import { useAuth } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';

import { updateProfile } from '../api';

type UseUpdateProfileOptions = {
  config?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ config }: UseUpdateProfileOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const { refetch } = useAuth();
  return useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'User Updated',
      });
      refetch({ cancelRefetch: false, throwOnError: false });
    },
    ...config,
    mutationFn: updateProfile,
  });
};
