import { useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Head } from '@/components/seo';
import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { Comments } from '@/features/comments';
import { formatDate } from '@/utils/format';

import { useDiscussion } from '../api/get-discussion';
import { UpdateDiscussion } from '../components/update-discussion';

export const DiscussionRoute = () => {
  const params = useParams();
  const discussionId = params.discussionId as string;
  const discussionQuery = useDiscussion({ discussionId });

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
        <span className="text-xs font-bold">
          {formatDate(discussionQuery.data.createdAt)}
        </span>
        {discussionQuery.data.author && (
          <span className="ml-2 text-sm font-bold">
            by {discussionQuery.data.author.firstName}{' '}
            {discussionQuery.data.author.lastName}
          </span>
        )}
        <div className="mt-6 flex flex-col space-y-16">
          <div className="flex justify-end">
            <UpdateDiscussion discussionId={discussionId} />
          </div>
          <div>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="mt-1 max-w-2xl text-sm text-gray-500">
                  <MDPreview value={discussionQuery.data.body} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Comments discussionId={discussionId} />
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
