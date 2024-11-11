'use client';

import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';
import { canDeleteDiscussion } from '@/lib/authorization';

import { useDeleteDiscussion } from '../api/delete-discussion';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const deleteDiscussionMutation = useDeleteDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Deleted',
        });
      },
    },
  });

  if (!canDeleteDiscussion(user?.data)) {
    return null;
  }

  return (
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
          onClick={() => deleteDiscussionMutation.mutate({ discussionId: id })}
        >
          Delete Discussion
        </Button>
      }
    />
  );
};
