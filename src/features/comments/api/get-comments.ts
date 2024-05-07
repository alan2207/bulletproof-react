import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Comment } from '../types';

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

type QueryFnType = typeof getComments;

export const getCommentsKey = (discussionId: string) => [
  'comments',
  discussionId,
];

type UseCommentsOptions = {
  discussionId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useComments = ({ discussionId, config }: UseCommentsOptions) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    queryKey: getCommentsKey(discussionId),
    queryFn: () => getComments({ discussionId }),
    ...config,
  });
};
