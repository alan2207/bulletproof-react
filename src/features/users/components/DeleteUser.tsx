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
          disabled={deleteUserMutation.isLoading}
          type="button"
          className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => deleteUserMutation.mutate({ userId: id })}
        >
          Delete
        </Button>
      }
    />
  );
};
