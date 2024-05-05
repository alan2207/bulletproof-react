import { Plus } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { Authorization, ROLES } from '@/features/auth';

import { CreateDiscussionDTO, useCreateDiscussion } from '../api/createDiscussion';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export const CreateDiscussion = () => {
  const createDiscussionMutation = useCreateDiscussion();

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
        <Form<CreateDiscussionDTO['data'], typeof schema>
          id="create-discussion"
          onSubmit={async (values) => {
            await createDiscussionMutation.mutateAsync({ data: values });
          }}
          schema={schema}
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
