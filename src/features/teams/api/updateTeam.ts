import { useMutation } from 'react-query';

import { axios } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

export type UpdateTeamDTO = {
  teamId: string;
  data: {
    name: string;
    description: string;
  };
};

export const updateTeam = ({ teamId, data }: UpdateTeamDTO) => {
  return axios.patch(`/teams/${teamId}`, data);
};

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
