'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Comments } from '@/features/comments/components/comments';
import { useDiscussion } from '@/features/discussions/api/get-discussion';
import { DiscussionView } from '@/features/discussions/components/discussion-view';

export const Discussion = ({ discussionId }: { discussionId: string }) => {
  const discussion = useDiscussion({ discussionId });

  return (
    <ContentLayout title={discussion?.data?.data?.title}>
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
