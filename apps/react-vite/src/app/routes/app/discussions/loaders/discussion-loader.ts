import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionQueryOptions } from '@/features/discussions/api/get-discussion';

export const discussionLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const discussionId = params.discussionId as string;

    const discussionQuery = getDiscussionQueryOptions(discussionId);
    const commentsQuery = getCommentsQueryOptions(discussionId);

    const promises = [
      queryClient.getQueryData(discussionQuery.queryKey) ??
        (await queryClient.fetchQuery(discussionQuery)),
      queryClient.getQueryData(commentsQuery.queryKey) ??
        (await queryClient.fetchQuery(commentsQuery)),
    ] as const;

    const [discussion, comments] = await Promise.all(promises);

    return {
      discussion,
      comments,
    };
  };
