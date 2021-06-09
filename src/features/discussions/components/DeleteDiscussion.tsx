import { Button, ConfirmationDialog } from '@/components/Elements';
import { queryClient } from '@/lib/react-query';

import { useDeleteDiscussion } from '../hooks/useDeleteDiscussion';

type DeleteDiscussionProps = {
  id: string;
};

export const DeleteDiscussion = ({ id }: DeleteDiscussionProps) => {
  // todo: optimistic update
  const deleteDiscussionMutation = useDeleteDiscussion({
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries(['discussions']);
      },
    },
  });
  return (
    <ConfirmationDialog
      icon="info"
      title="Delete Discussion"
      triggerButton={<Button variant="danger">Delete</Button>}
      confirmButton={
        <button
          disabled={deleteDiscussionMutation.isLoading}
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => deleteDiscussionMutation.mutate({ discussionId: id })}
        >
          Deactivate
        </button>
      }
    />
  );
};
