'use client';

import { useParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Spinner } from '@/components/ui/spinner';
import { Comments } from '@/features/comments/components/comments';
import { useDiscussion } from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

const DiscussionPage = () => {
  const params = useParams();
  const discussionId = params?.discussionId as string;

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

export default DiscussionPage;
