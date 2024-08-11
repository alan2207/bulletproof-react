import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { getCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

export const discussionsLoader = (queryClient: QueryClient) => async () => {
  const query = getDiscussionsQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

export const DiscussionsRoute = () => {
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
            queryClient.prefetchQuery(getCommentsQueryOptions(id));
          }}
        />
      </div>
    </ContentLayout>
  );
};
