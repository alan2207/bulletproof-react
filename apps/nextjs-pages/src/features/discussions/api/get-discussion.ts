import { useQuery, queryOptions } from '@tanstack/react-query';

import { api, attachCookie } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Discussion } from '@/types/api';

export const getDiscussion = ({
  discussionId,
  cookie,
}: {
  discussionId: string;
  cookie?: string;
}): Promise<{ data: Discussion }> => {
  return api.get(`/discussions/${discussionId}`, {
    headers: attachCookie(cookie).headers,
  });
};

export const getDiscussionQueryOptions = (
  discussionId: string,
  cookie?: string,
) => {
  return queryOptions({
    queryKey: ['discussions', discussionId],
    queryFn: () => getDiscussion({ discussionId, cookie }),
  });
};

type UseDiscussionOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getDiscussionQueryOptions>;
};

export const useDiscussion = ({
  discussionId,
  queryConfig,
}: UseDiscussionOptions) => {
  return useQuery({
    ...getDiscussionQueryOptions(discussionId),
    ...queryConfig,
  });
};
