import { ContentLayout } from '@/components/layouts';

import { CreateDiscussion } from '../components/CreateDiscussion';
import { DiscussionsList } from '../components/DiscussionsList';

export const DiscussionsRoute = () => {
  return (
    <ContentLayout title="Discussions">
      <div className="flex justify-end">
        <CreateDiscussion />
      </div>
      <div className="mt-4">
        <DiscussionsList />
      </div>
    </ContentLayout>
  );
};
