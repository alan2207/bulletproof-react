import { useQueryClient } from '@tanstack/react-query';
import { ReactElement } from 'react';

import { ContentLayout, DashboardLayout } from '@/components/layouts';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

export const DiscussionsPage = () => {
  const queryClient = useQueryClient();

  return (
    <>
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
    </>
  );
};

DiscussionsPage.getLayout = (page: ReactElement) => {
  return (
    <DashboardLayout>
      <ContentLayout title="Discussions">{page}</ContentLayout>
    </DashboardLayout>
  );
};
