import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import {
  getDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';

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

  return {
    dehydratedState: dehydrate(queryClient),
  };
};

const PublicDiscussionPage = async ({
  params: { discussionId },
}: {
  params: {
    discussionId: string;
  };
}) => {
  const { dehydratedState } = await preloadData(discussionId);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Discussion discussionId={discussionId} />
    </HydrationBoundary>
  );
};

export default PublicDiscussionPage;
