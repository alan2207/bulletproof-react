import { Button } from '@/components/Elements';
import { Form, InputField, MDField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';

import { useCreateDiscussion } from '../hooks/useCreateDiscussion';

type DiscussionValues = {
  title: string;
  body: string;
};

export const CreateDiscussionForm = () => {
  const createDiscussionMutation = useCreateDiscussion();

  return (
    <FormDrawer
      isDone={createDiscussionMutation.isSuccess}
      triggerButton={<Button size="sm">Create Discussion</Button>}
      title="Create Discussion"
      submitButton={
        <Button
          form="create-discussion"
          type="submit"
          size="sm"
          disabled={createDiscussionMutation.isLoading}
        >
          Submit
        </Button>
      }
    >
      <Form<DiscussionValues>
        id="create-discussion"
        onSubmit={async (values) => {
          await createDiscussionMutation.mutateAsync({ data: values });
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
