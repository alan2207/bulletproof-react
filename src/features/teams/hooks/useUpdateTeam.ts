import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { updateTeam } from '../api';

type UseUpdateDiscussionOptions = {
  config?: MutationConfig<typeof updateTeam>;
};

export const useUpdateDiscussion = ({ config }: UseUpdateDiscussionOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: updateTeam,
  });
};
