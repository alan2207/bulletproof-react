import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getDiscussionsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const DiscussionsRoute = () => {
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

export default DiscussionsRoute;
