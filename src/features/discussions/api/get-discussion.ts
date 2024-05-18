import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Discussion } from '@/types/api';

export const getDiscussion = ({
  discussionId,
}: {
  discussionId: string;
}): Promise<Discussion> => {
  return api.get(`/discussions/${discussionId}`);
};

export const getDiscussionsQueryOptions = (discussionId: string) => {
  return queryOptions({
    queryKey: ['discussions', discussionId],
    queryFn: () => getDiscussion({ discussionId }),
  });
};

type UseDiscussionOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

export const useDiscussion = ({
  discussionId,
  queryConfig,
}: UseDiscussionOptions) => {
  return useQuery({
    ...getDiscussionsQueryOptions(discussionId),
    ...queryConfig,
  });
};
