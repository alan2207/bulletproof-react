import { PencilIcon } from '@heroicons/react/solid';

import { Button } from '@/components/Elements';
import { Form, InputField, MDField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';

import { useDiscussion } from '../hooks/useDiscussion';
import { useUpdateDiscussion } from '../hooks/useUpdateDiscussion';

type DiscussionValues = {
  title: string;
  body: string;
};

type UpdateDiscussionProps = {
  discussionId: string;
};

export const UpdateDiscussion = ({ discussionId }: UpdateDiscussionProps) => {
  const discussionQuery = useDiscussion({ discussionId });
  const updateDiscussionMutation = useUpdateDiscussion();

  return (
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
      <Form<DiscussionValues>
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
      >
        {({ register, formState, control }) => (
          <>
            <InputField
              label="Title"
              error={formState.errors['title']}
              registration={register('title')}
            />
            <MDField name="body" label="Body" error={formState.errors['body']} control={control} />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
