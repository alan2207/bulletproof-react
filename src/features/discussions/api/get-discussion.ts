import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { Discussion } from '../types';

export const getDiscussion = ({
  discussionId,
}: {
  discussionId: string;
}): Promise<Discussion> => {
  return api.get(`/discussions/${discussionId}`);
};

type QueryFnType = typeof getDiscussion;

type UseDiscussionOptions = {
  discussionId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useDiscussion = ({
  discussionId,
  config,
}: UseDiscussionOptions) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['discussion', discussionId],
    queryFn: () => getDiscussion({ discussionId }),
  });
};
