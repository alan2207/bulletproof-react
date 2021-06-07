import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getDiscussion } from '../api';

type UseDiscussionOptions = {
  discussionId: string;
  config?: QueryConfig<typeof getDiscussion>;
};

export const useDiscussion = ({ discussionId, config }: UseDiscussionOptions) => {
  return useQuery({
    ...config,
    queryKey: ['discussion', discussionId],
    queryFn: () => getDiscussion({ discussionId }),
  });
};
