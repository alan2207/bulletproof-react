import { TrashIcon } from '@heroicons/react/outline';

import { Button, ConfirmationDialog } from '@/components/Elements';

import { useDeleteComment } from '../api/deleteComment';

type DeleteCommentProps = {
  id: string;
  discussionId: string;
};

export const DeleteComment = ({ id, discussionId }: DeleteCommentProps) => {
  const deleteCommentMutation = useDeleteComment({ discussionId });

  return (
    <ConfirmationDialog
      isDone={deleteCommentMutation.isSuccess}
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
          isLoading={deleteCommentMutation.isLoading}
          type="button"
          className="bg-red-600"
          onClick={async () => await deleteCommentMutation.mutateAsync({ commentId: id })}
        >
          Delete Comment
        </Button>
      }
    />
  );
};
