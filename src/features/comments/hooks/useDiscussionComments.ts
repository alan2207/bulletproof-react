import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getDiscussionComments } from '../api';

type UseDiscussionCommentsOptions = {
  discussionId: string;
  config?: QueryConfig<typeof getDiscussionComments>;
};

export const useDiscussionComments = ({ discussionId, config }: UseDiscussionCommentsOptions) => {
  return useQuery({
    ...config,
    queryKey: ['comments', discussionId],
    queryFn: () => getDiscussionComments({ discussionId }),
  });
};
