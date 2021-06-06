import { useMutation } from 'react-query';

import { updateDiscussion } from '../api';

type UseUpdateDiscussionOptions = {
  discussionId: string;
};

export const useUpdateDiscussion = ({ discussionId }: UseUpdateDiscussionOptions) => {
  return useMutation({
    mutationFn: (data: Parameters<typeof updateDiscussion>[0]['data']) =>
      updateDiscussion({ data, discussionId }),
  });
};
