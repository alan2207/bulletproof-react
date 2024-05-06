import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Comment } from '../types';

export const getComments = ({
  discussionId,
}: {
  discussionId: string;
}): Promise<Comment[]> => {
  return axios.get(`/comments`, {
    params: {
      discussionId,
    },
  });
};

type QueryFnType = typeof getComments;

type UseCommentsOptions = {
  discussionId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useComments = ({ discussionId, config }: UseCommentsOptions) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    queryKey: ['comments', discussionId],
    queryFn: () => getComments({ discussionId }),
    ...config,
  });
};
