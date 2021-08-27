import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussion = ({ discussionId }: { discussionId: string }): Promise<Discussion> => {
  return axios.get(`/discussions/${discussionId}`);
};
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
