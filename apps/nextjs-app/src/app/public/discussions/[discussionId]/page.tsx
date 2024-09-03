import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import DiscussionPage from '@/app/app/discussions/[discussionId]/page';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import {
  getDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';

export const generateMetadata = async ({
  params,
}: {
  params: { discussionId: string };
}) => {
  const discussion = await getDiscussion({
    discussionId: params.discussionId,
  });

  const name = discussion.data.title;

  return {
    title: name,
  };
};

const preloadData = async (discussionId: string) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getDiscussionQueryOptions(discussionId));
  await queryClient.prefetchInfiniteQuery(
    getInfiniteCommentsQueryOptions(discussionId),
  );

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
      <DiscussionPage />
    </HydrationBoundary>
  );
};

export default PublicDiscussionPage;
