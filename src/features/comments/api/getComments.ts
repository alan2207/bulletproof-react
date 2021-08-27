import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';

import { Comment } from '../types';

export const getComments = ({ discussionId }: { discussionId: string }): Promise<Comment[]> => {
  return axios.get(`/comments`, {
    params: {
      discussionId,
    },
  });
};

type UseCommentsOptions = {
  discussionId: string;
  config?: QueryConfig<typeof getComments>;
};

export const useComments = ({ discussionId, config }: UseCommentsOptions) => {
  return useQuery({
    ...config,
    queryKey: ['comments', discussionId],
    queryFn: () => getComments({ discussionId }),
  });
};
