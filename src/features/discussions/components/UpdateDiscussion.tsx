import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '@/components/Elements';
import { Form, InputField, TextAreaField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';
import { RBAC, ROLES } from '@/lib/rbac';

import { useDiscussion } from '../hooks/useDiscussion';
import { useUpdateDiscussion } from '../hooks/useUpdateDiscussion';
type DiscussionValues = {
  title: string;
  body: string;
};

type UpdateDiscussionProps = {
  discussionId: string;
};

const schema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export const UpdateDiscussion = ({ discussionId }: UpdateDiscussionProps) => {
  const discussionQuery = useDiscussion({ discussionId });
  const updateDiscussionMutation = useUpdateDiscussion();

  return (
    <RBAC allowedRoles={[ROLES.ADMIN]}>
      <FormDrawer
        isDone={updateDiscussionMutation.isSuccess}
        triggerButton={
          <Button startIcon={<PencilIcon className="h-4 w-4" />} size="sm">
            Update Discussion
          </Button>
        }
        title="Update Discussion"
        submitButton={
          <Button
            form="update-discussion"
            type="submit"
            size="sm"
            isLoading={updateDiscussionMutation.isLoading}
          >
            Submit
          </Button>
        }
      >
        <Form<DiscussionValues, typeof schema>
          id="update-discussion"
          onSubmit={async (values) => {
            await updateDiscussionMutation.mutateAsync({ data: values, discussionId });
          }}
          options={{
            defaultValues: {
              title: discussionQuery.data?.title,
              body: discussionQuery.data?.body,
            },
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
