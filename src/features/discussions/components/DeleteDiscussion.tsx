import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { Authorization, ROLES } from '@/features/auth';

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
          <Button variant="destructive" icon={<Trash className="size-4" />}>
            Delete Discussion
          </Button>
        }
        confirmButton={
          <Button
            isLoading={deleteDiscussionMutation.isPending}
            type="button"
            variant="destructive"
            onClick={async () => await deleteDiscussionMutation.mutateAsync({ discussionId: id })}
          >
            Delete Discussion
          </Button>
        }
      />
    </Authorization>
  );
};
