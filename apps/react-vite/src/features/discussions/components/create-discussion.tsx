import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { Authorization, ROLES } from '@/lib/authorization';

import {
  createDiscussionInputSchema,
  useCreateDiscussion,
} from '../api/create-discussion';

export const CreateDiscussion = () => {
  const { addNotification } = useNotifications();
  const createDiscussionMutation = useCreateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Created',
        });
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormDrawer
        isDone={createDiscussionMutation.isSuccess}
        triggerButton={
          <Button size="sm" icon={<Plus className="size-4" />}>
            Create Discussion
          </Button>
        }
        title="Create Discussion"
        submitButton={
          <Button
            form="create-discussion"
            type="submit"
            size="sm"
            isLoading={createDiscussionMutation.isPending}
          >
            Submit
          </Button>
        }
      >
        <Form
          id="create-discussion"
          onSubmit={(values) => {
            createDiscussionMutation.mutate({ data: values });
          }}
          schema={createDiscussionInputSchema}
        >
          {({ register, formState }) => (
            <>
              <Input
                label="Title"
                error={formState.errors['title']}
                registration={register('title')}
              />

              <Textarea
                label="Body"
                error={formState.errors['body']}
                registration={register('body')}
              />
            </>
          )}
        </Form>
      </FormDrawer>
    </Authorization>
  );
};
