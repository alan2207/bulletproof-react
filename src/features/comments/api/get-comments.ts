import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Comment } from '@/types/api';

export const getComments = ({
  discussionId,
}: {
  discussionId: string;
}): Promise<Comment[]> => {
  return api.get(`/comments`, {
    params: {
      discussionId,
    },
  });
};

export const getCommentsQueryOptions = (discussionId: string) => {
  return queryOptions({
    queryKey: ['comments', discussionId],
    queryFn: () => getComments({ discussionId }),
  });
};

type UseCommentsOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getComments>;
};

export const useComments = ({
  discussionId,
  queryConfig,
}: UseCommentsOptions) => {
  return useQuery({
    ...getCommentsQueryOptions(discussionId),
    ...queryConfig,
  });
};
