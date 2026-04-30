import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ContentLayout, DashboardLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { Comments } from '@/features/comments/components/comments';
import {
  useDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

type DiscussionPageProps = {
  dehydratedState?: unknown;
};

export const getServerSideProps = (async ({ query, req }) => {
  const queryClient = new QueryClient();
  const discussionId = query.discussionId as string;
  const cookie = req.headers.cookie;

  await queryClient.prefetchQuery(
    getDiscussionQueryOptions(discussionId, cookie),
  );
  await queryClient.prefetchInfiniteQuery(
    getInfiniteCommentsQueryOptions(discussionId, cookie),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<DiscussionPageProps>;

export const DiscussionPage = () => {
  const router = useRouter();
  const discussionId = router.query.discussionId as string;

  const discussionQuery = useDiscussion({
    discussionId,
  });

  if (discussionQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussion = discussionQuery.data?.data;

  if (!discussion) return null;

  return (
    <ContentLayout title={discussion.title}>
      <DiscussionView discussionId={discussionId} />
      <div className="mt-8">
        <ErrorBoundary
          fallback={
            <div>Failed to load comments. Try to refresh the page.</div>
          }
        >
          <Comments discussionId={discussionId} />
        </ErrorBoundary>
      </div>
    </ContentLayout>
  );
};

DiscussionPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const PublicDiscussionPage = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <DiscussionPage />
    </HydrationBoundary>
  );
};
