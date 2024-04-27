import { useParams } from 'react-router-dom';

import { Spinner, MDPreview } from '@/components/Elements';
import { Head } from '@/components/Head';
import { ContentLayout } from '@/components/Layout';
import { Comments } from '@/features/comments';
import { formatDate } from '@/utils/format';

import { useDiscussion } from '../api/getDiscussion';
import { UpdateDiscussion } from '../components/UpdateDiscussion';

export const Discussion = () => {
  const { discussionId } = useParams();
  const discussionQuery = useDiscussion({ discussionId });

  if (discussionQuery.isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!discussionQuery.data) return null;

  return (
    <>
      <Head title={discussionQuery.data.title} />
      <ContentLayout title={discussionQuery.data.title}>
        <span className="text-xs font-bold">{formatDate(discussionQuery.data.createdAt)}</span>
        {discussionQuery.data.author && (
          <span className="ml-2 text-sm font-bold">
            by {discussionQuery.data.author.firstName} {discussionQuery.data.author.lastName}
          </span>
        )}
        <div className="flex flex-col mt-6 space-y-16">
          <div className="flex justify-end">
            <UpdateDiscussion discussionId={discussionId} />
          </div>
          <div>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="max-w-2xl mt-1 text-sm text-gray-500">
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
