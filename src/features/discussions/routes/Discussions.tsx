import { ContentLayout } from '@/components/Layout';

import { CreateDiscussionForm } from '../components/CreateDiscussionForm';
import { DiscussionsList } from '../components/DiscussionsList';

export const Discussions = () => {
  return (
    <ContentLayout title="Discussions">
      <div className="flex justify-end">
        <CreateDiscussionForm />
      </div>
      <div className="mt-4">
        <DiscussionsList />
      </div>
    </ContentLayout>
  );
};
