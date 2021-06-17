import { useMutation } from 'react-query';

import { useNotificationStore } from '@/hooks/useNotificationStore';
import { MutationConfig } from '@/lib/react-query';

import { updateTeam } from '../api';

type UseUpdateDiscussionOptions = {
  config?: MutationConfig<typeof updateTeam>;
};

export const useUpdateDiscussion = ({ config }: UseUpdateDiscussionOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: updateTeam,
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Profile Updated',
      });
    },
  });
};
