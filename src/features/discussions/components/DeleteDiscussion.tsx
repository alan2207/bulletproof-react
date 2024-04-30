import { TrashIcon } from '@heroicons/react/16/solid';

import { Button, ConfirmationDialog } from '@/components/Elements';
import { Authorization, ROLES } from '@/lib/authorization';

import { useDeleteDiscussion } from '../api/deleteDiscussion';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  const deleteDiscussionMutation = useDeleteDiscussion();

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <ConfirmationDialog
        icon="danger"
        title="Delete Discussion"
        body="Are you sure you want to delete this discussion?"
        triggerButton={
          <Button variant="danger" startIcon={<TrashIcon className="size-4" />}>
            Delete Discussion
          </Button>
        }
        confirmButton={
          <Button
            isLoading={deleteDiscussionMutation.isPending}
            type="button"
            className="bg-red-600"
            onClick={async () => await deleteDiscussionMutation.mutateAsync({ discussionId: id })}
          >
            Delete Discussion
          </Button>
        }
      />
    </Authorization>
  );
};
