import { PlusIcon } from '@heroicons/react/outline';
import * as z from 'zod';

import { Button } from '@/components/Elements';
import { Form, FormDrawer, InputField, TextAreaField } from '@/components/Form';
import { RBAC, ROLES } from '@/lib/rbac';

import { useCreateDiscussion } from '../hooks/useCreateDiscussion';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

type DiscussionValues = {
  title: string;
  body: string;
};

export const CreateDiscussion = () => {
  const createDiscussionMutation = useCreateDiscussion();

  return (
    <RBAC allowedRoles={[ROLES.ADMIN]}>
      <FormDrawer
        isDone={createDiscussionMutation.isSuccess}
        triggerButton={
          <Button size="sm" startIcon={<PlusIcon className="h-4 w-4" />}>
            Create Discussion
          </Button>
        }
        title="Create Discussion"
        submitButton={
          <Button
            form="create-discussion"
            type="submit"
            size="sm"
            isLoading={createDiscussionMutation.isLoading}
          >
            Submit
          </Button>
        }
      >
        <Form<DiscussionValues, typeof schema>
          id="create-discussion"
          onSubmit={async (values) => {
            await createDiscussionMutation.mutateAsync({ data: values });
          }}
          schema={schema}
        >
          {({ register, formState }) => (
            <>
              <InputField
                label="Title"
                error={formState.errors['title']}
                registration={register('title')}
              />

              <TextAreaField
                label="Body"
                error={formState.errors['body']}
                registration={register('body')}
              />
            </>
          )}
        </Form>
      </FormDrawer>
    </RBAC>
  );
};
