import { Spinner } from '@/components/Elements/Spinner';
import { ContentLayout } from '@/components/Layout';

import { CreateDiscussionForm } from '../components/CreateDiscussionForm';
import { useDiscussions } from '../hooks/useDiscussions';

export const Discussions = () => {
  const discussionsQuery = useDiscussions();

  if (discussionsQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <ContentLayout title="Discussions">
      <CreateDiscussionForm />
      {discussionsQuery.data?.map((discussion) => (
        <div key={discussion.id}>{discussion.title}</div>
      ))}
    </ContentLayout>
  );
};
