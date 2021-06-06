import { useQuery, UseQueryOptions } from 'react-query';

import { getDiscussionComments } from '../api';

type UseDiscussionCommentsOptions = {
  discussionId: string;
  config: UseQueryOptions;
};

export const useDiscussionComments = ({
  discussionId,
  config = {},
}: UseDiscussionCommentsOptions) => {
  return useQuery({
    ...config,
    queryKey: ['comments', discussionId],
    queryFn: () => getDiscussionComments({ discussionId }),
  });
};
