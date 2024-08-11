import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { Comments } from '@/features/comments/components/comments';
import {
  useDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

export const discussionLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const discussionId = params.discussionId as string;

    const discussionQuery = getDiscussionQueryOptions(discussionId);
    const commentsQuery = getInfiniteCommentsQueryOptions(discussionId);

    const promises = [
      queryClient.getQueryData(discussionQuery.queryKey) ??
        (await queryClient.fetchQuery(discussionQuery)),
      queryClient.getQueryData(commentsQuery.queryKey) ??
        (await queryClient.fetchInfiniteQuery(commentsQuery)),
    ] as const;

    const [discussion, comments] = await Promise.all(promises);

    return {
      discussion,
      comments,
    };
  };

export const DiscussionRoute = () => {
  const params = useParams();
  const discussionId = params.discussionId as string;
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
    <>
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
    </>
  );
};
