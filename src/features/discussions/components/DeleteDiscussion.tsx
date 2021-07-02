import { Button, ConfirmationDialog } from '@/components/Elements';
import { RBAC, ROLES } from '@/lib/rbac';

import { useDeleteDiscussion } from '../hooks/useDeleteDiscussion';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  const deleteDiscussionMutation = useDeleteDiscussion();

  return (
    <RBAC allowedRoles={[ROLES.ADMIN]}>
      <ConfirmationDialog
        icon="danger"
        title="Delete Discussion"
        body="Are you sure you want to delete this discussion?"
        triggerButton={<Button variant="danger">Delete</Button>}
        confirmButton={
          <Button
            isLoading={deleteDiscussionMutation.isLoading}
            type="button"
            className="bg-red-600"
            onClick={async () => await deleteDiscussionMutation.mutateAsync({ discussionId: id })}
          >
            Delete
          </Button>
        }
      />
    </RBAC>
  );
};
