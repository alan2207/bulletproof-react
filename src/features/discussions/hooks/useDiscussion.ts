import { useQuery } from 'react-query';

import { getDiscussion } from '../api';

type UseDiscussionOptions = {
  discussionId: string;
};

export const useDiscussion = ({ discussionId }: UseDiscussionOptions) => {
  return useQuery({
    queryKey: ['discussion', discussionId],
    queryFn: () => getDiscussion({ discussionId }),
  });
};
