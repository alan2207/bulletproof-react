import { PlusIcon } from '@heroicons/react/outline';
import * as z from 'zod';

import { Button } from '@/components/Elements';
import { Form, FormDrawer, TextAreaField } from '@/components/Form';

import { CreateCommentDTO, useCreateComment } from '../api/createComment';

const schema = z.object({
  body: z.string().min(1, 'Required'),
});

type CreateCommentProps = {
  discussionId: string;
};

export const CreateComment = ({ discussionId }: CreateCommentProps) => {
  const createCommentMutation = useCreateComment({ discussionId });
  return (
    <>
      <FormDrawer
        isDone={createCommentMutation.isSuccess}
        triggerButton={
          <Button size="sm" startIcon={<PlusIcon className="h-4 w-4" />}>
            Create Comment
          </Button>
        }
        title="Create Comment"
        submitButton={
          <Button
            isLoading={createCommentMutation.isLoading}
            form="create-comment"
            type="submit"
            size="sm"
            disabled={createCommentMutation.isLoading}
          >
            Submit
          </Button>
        }
      >
        <Form<CreateCommentDTO['data'], typeof schema>
          id="create-comment"
          onSubmit={async (values) => {
            await createCommentMutation.mutateAsync({
              data: {
                body: values.body,
                discussionId,
              },
            });
          }}
          schema={schema}
        >
          {({ register, formState }) => (
            <TextAreaField
              label="Body"
              error={formState.errors['body']}
              registration={register('body')}
            />
          )}
        </Form>
      </FormDrawer>
    </>
  );
};
