import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import {
  getDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';

import { Discussion } from './_components/discussion';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) => {
  const discussionId = (await params).discussionId;

  const discussion = await getDiscussion({ discussionId });

  return {
    title: discussion.data?.title,
    description: discussion.data?.title,
  };
};

const preloadData = async (discussionId: string) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getDiscussionQueryOptions(discussionId)),
    queryClient.prefetchInfiniteQuery(
      getInfiniteCommentsQueryOptions(discussionId),
    ),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return {
    dehydratedState,
    queryClient,
  };
};

const DiscussionPage = async ({
  params,
}: {
  params: Promise<{
    discussionId: string;
  }>;
}) => {
  const discussionId = (await params).discussionId;

  const { dehydratedState, queryClient } = await preloadData(discussionId);

  const discussion = queryClient.getQueryData(
    getDiscussionQueryOptions(discussionId).queryKey,
  );

  if (!discussion?.data) return <div>Discussion not found</div>;

  return (
    <HydrationBoundary state={dehydratedState}>
      <Discussion discussionId={discussionId} />
    </HydrationBoundary>
  );
};

export default DiscussionPage;
