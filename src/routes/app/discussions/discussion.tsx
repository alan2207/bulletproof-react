import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Head } from '@/components/seo';
import { Spinner } from '@/components/ui/spinner';
import { Comments } from '@/features/comments/components/comments';
import { useDiscussion } from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

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

  if (!discussionQuery.data) return null;

  return (
    <>
      <Head title={discussionQuery.data.title} />
      <ContentLayout title={discussionQuery.data.title}>
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
