import { Button, ConfirmationDialog } from '@/components/Elements';

import { useDeleteDiscussion } from '../hooks/useDeleteDiscussion';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  const deleteDiscussionMutation = useDeleteDiscussion();

  return (
    <ConfirmationDialog
      icon="danger"
      title="Delete Discussion"
      body="Are you sure you want to delete this discussion?"
      triggerButton={<Button variant="danger">Delete</Button>}
      confirmButton={
        <button
          disabled={deleteDiscussionMutation.isLoading}
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => deleteDiscussionMutation.mutate({ discussionId: id })}
        >
          Delete
        </button>
      }
    />
  );
};
