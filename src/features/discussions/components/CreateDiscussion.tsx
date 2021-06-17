import { PlusIcon } from '@heroicons/react/outline';
import * as z from 'zod';

import { Button } from '@/components/Elements';
import { Form, InputField, MDField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';

import { useCreateDiscussion } from '../hooks/useCreateDiscussion';

const schema = z.object({
  title: z.string().nonempty({ message: 'Required' }),
  body: z.string().nonempty({ message: 'Required' }),
});

type DiscussionValues = {
  title: string;
  body: string;
};

export const CreateDiscussion = () => {
  const createDiscussionMutation = useCreateDiscussion();

  return (
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
