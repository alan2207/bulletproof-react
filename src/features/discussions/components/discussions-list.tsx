import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { formatDate } from '@/utils/format';

import { useDiscussions } from '../api/get-discussions';
import { Discussion } from '../types';

import { DeleteDiscussion } from './delete-discussion';

export const DiscussionsList = () => {
  const discussionsQuery = useDiscussions();

  if (discussionsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!discussionsQuery.data) return null;

  return (
    <Table<Discussion>
      data={discussionsQuery.data}
      columns={[
        {
          title: 'Title',
          field: 'title',
        },
        {
          title: 'Created At',
          field: 'createdAt',
          Cell({ entry: { createdAt } }) {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <Link to={`./${id}`}>View</Link>;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <DeleteDiscussion id={id} />;
          },
        },
      ]}
    />
  );
};
