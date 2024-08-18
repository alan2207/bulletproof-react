import {
  HydrationBoundary,
  QueryClient,
  useQueryClient,
  dehydrate,
} from '@tanstack/react-query';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import { ContentLayout, DashboardLayout } from '@/components/layouts';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionsList } from '@/features/discussions/components/discussions-list';

type DiscussionsPageProps = {
  dehydratedState?: unknown;
};

export const getServerSideProps = (async ({ query, req }) => {
  const queryClient = new QueryClient();
  const page = Number(query.page || 1);
  const cookie = req.headers.cookie;

  await queryClient.prefetchQuery(getDiscussionsQueryOptions({ page, cookie }));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<DiscussionsPageProps>;

const DiscussionsPage = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const queryClient = useQueryClient();

  return (
    <HydrationBoundary state={dehydratedState}>
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
    </HydrationBoundary>
  );
};

DiscussionsPage.getLayout = (page: ReactElement) => {
  return (
    <DashboardLayout>
      <ContentLayout title="Discussions">{page}</ContentLayout>
    </DashboardLayout>
  );
};

export default DiscussionsPage;
