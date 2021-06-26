import { Button, ConfirmationDialog } from '@/components/Elements';

import { useDeleteUser } from '../hooks/useDeleteUser';

type DeleteUserProps = {
  id: string;
};

export const DeleteUser = ({ id }: DeleteUserProps) => {
  const deleteUserMutation = useDeleteUser();

  return (
    <ConfirmationDialog
      icon="danger"
      title="Delete User"
      body="Are you sure you want to delete this user?"
      triggerButton={<Button variant="danger">Delete</Button>}
      confirmButton={
        <Button
          isLoading={deleteUserMutation.isLoading}
          type="button"
          className="bg-red-600"
          onClick={() => deleteUserMutation.mutate({ userId: id })}
        >
          Delete
        </Button>
      }
    />
  );
};
