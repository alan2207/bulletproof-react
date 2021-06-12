import { Table, Spinner } from '@/components/Elements';

import { useUsers } from '../hooks/useUsers';
import { User } from '../types';

import { DeleteUser } from './DeleteUser';

export const UsersList = () => {
  const usersQuery = useUsers();

  console.log(usersQuery);

  if (usersQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!usersQuery.data) return null;

  return (
    <Table<User>
      data={usersQuery.data}
      columns={[
        {
          title: 'First Name',
          field: 'firstName',
        },
        {
          title: 'Last Name',
          field: 'lastName',
        },
        {
          title: 'Email',
          field: 'email',
        },
        {
          title: 'Role',
          field: 'role',
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <DeleteUser id={id} />;
          },
        },
      ]}
    />
  );
};
