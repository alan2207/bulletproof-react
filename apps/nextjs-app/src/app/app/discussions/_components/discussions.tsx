'use client';

import { useQueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts/content-layout';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

export const Discussions = () => {
  const queryClient = useQueryClient();

  return (
    <ContentLayout title="Discussions">
      <div className="flex justify-end">
        <CreateDiscussion />
      </div>
      <div className="mt-4">
        <DiscussionsList
          onDiscussionPrefetch={(id) => {
            // Prefetch the comments data when the user hovers over the link in the list
            queryClient.prefetchInfiniteQuery(
              getInfiniteCommentsQueryOptions(id),
            );
          }}
        />
      </div>
    </ContentLayout>
  );
};
