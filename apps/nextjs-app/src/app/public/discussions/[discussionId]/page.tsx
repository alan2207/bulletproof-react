import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

import DiscussionPage from '@/app/app/discussions/[discussionId]/page';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionQueryOptions } from '@/features/discussions/api/get-discussion';

const preloadData = async (discussionId: string) => {
  const queryClient = new QueryClient();

  const cookieStore = cookies();

  const cookie = cookieStore.get('bulletproof_react_app_token')?.value;

  await queryClient.prefetchQuery(
    getDiscussionQueryOptions(discussionId, cookie),
  );
  await queryClient.prefetchInfiniteQuery(
    getInfiniteCommentsQueryOptions(discussionId, cookie),
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
