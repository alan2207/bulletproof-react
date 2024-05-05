import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';

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
        <Button variant="destructive" size="sm" icon={<Trash className="size-4" />}>
          Delete Comment
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteCommentMutation.isPending}
          type="button"
          variant="destructive"
          onClick={async () => await deleteCommentMutation.mutateAsync({ commentId: id })}
        >
          Delete Comment
        </Button>
      }
    />
  );
};
