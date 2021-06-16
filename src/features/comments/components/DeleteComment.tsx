import { TrashIcon } from '@heroicons/react/outline';

import { Button, ConfirmationDialog } from '@/components/Elements';

import { useDeleteComment } from '../hooks/useDeleteComment';

type DeleteCommentProps = {
  id: string;
  discussionId: string;
};

export const DeleteComment = ({ id, discussionId }: DeleteCommentProps) => {
  const deleteCommentMutation = useDeleteComment({ discussionId });

  return (
    <ConfirmationDialog
      icon="danger"
      title="Delete Comment"
      body="Are you sure you want to delete this comment?"
      triggerButton={
        <Button variant="danger" size="sm" startIcon={<TrashIcon className="h-4 w-4" />}>
          Delete Comment
        </Button>
      }
      confirmButton={
        <Button
          disabled={deleteCommentMutation.isLoading}
          type="button"
          className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => deleteCommentMutation.mutate({ commentId: id })}
        >
          Delete
        </Button>
      }
    />
  );
};
