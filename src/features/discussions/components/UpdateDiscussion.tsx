import { Pen } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { Authorization, ROLES } from '@/features/auth';

import { useDiscussion } from '../api/getDiscussion';
import { UpdateDiscussionDTO, useUpdateDiscussion } from '../api/updateDiscussion';

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
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormDrawer
        isDone={updateDiscussionMutation.isSuccess}
        triggerButton={
          <Button icon={<Pen className="size-4" />} size="sm">
            Update Discussion
          </Button>
        }
        title="Update Discussion"
        submitButton={
          <Button
            form="update-discussion"
            type="submit"
            size="sm"
            isLoading={updateDiscussionMutation.isPending}
          >
            Submit
          </Button>
        }
      >
        <Form<UpdateDiscussionDTO['data'], typeof schema>
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
