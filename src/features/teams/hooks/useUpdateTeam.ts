import { useMutation } from 'react-query';

import { updateTeam } from '../api';

type UseUpdateDiscussionOptions = {
  teamId: string;
};

export const useUpdateDiscussion = ({ teamId }: UseUpdateDiscussionOptions) => {
  return useMutation({
    mutationFn: (data: Parameters<typeof updateTeam>[0]['data']) => updateTeam({ data, teamId }),
  });
};
