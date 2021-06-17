import { useMutation } from 'react-query';

import { useNotificationStore } from '@/hooks/useNotificationStore';
import { MutationConfig, queryClient } from '@/lib/react-query';

import { updateDiscussion } from '../api';

type UseUpdateDiscussionOptions = {
  config?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({ config }: UseUpdateDiscussionOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: updateDiscussion,
    onSuccess: (data) => {
      queryClient.refetchQueries(['discussion', data.id]);
      addNotification({
        type: 'success',
        title: 'Discussion Updated',
      });
    },
  });
};
