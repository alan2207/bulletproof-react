import { Button } from '@/components/Elements';
import { Form, InputField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';
import { TextAreaField } from '@/components/Form/TextareaField';
import { queryClient } from '@/lib/react-query';

import { useCreateDiscussion } from '../hooks/useCreateDiscussion';

type DiscussionValues = {
  title: string;
  description: string;
};

export const CreateDiscussionForm = () => {
  const createDiscussionMutation = useCreateDiscussion({
    config: {
      onSuccess: () => queryClient.invalidateQueries(['discussions']),
    },
  });
  return (
    <FormDrawer
      isDone={createDiscussionMutation.isSuccess}
      triggerButton={<Button size="sm">Create Discussion</Button>}
      title="Create Discussion"
      submitButton={
        <Button form="create-discussion" type="submit" size="sm">
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
        {({ register, formState }) => (
          <>
            <InputField
              label="Title"
              error={formState.errors['title']}
              registration={register('title')}
            />

            <TextAreaField
              label="Description"
              error={formState.errors['description']}
              registration={register('description')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
