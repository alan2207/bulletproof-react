import { useMutation } from 'react-query';

import { useNotificationStore } from '@/hooks/useNotificationStore';
import { MutationConfig } from '@/lib/react-query';

import { updateProfile } from '../api';

type UseUpdateProfileOptions = {
  config?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ config }: UseUpdateProfileOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: updateProfile,
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'User Deleted',
      });
    },
  });
};
