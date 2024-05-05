import { Plus } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Textarea } from '@/components/ui/form';

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
          <Button size="sm" icon={<Plus className="size-4" />}>
            Create Comment
          </Button>
        }
        title="Create Comment"
        submitButton={
          <Button
            isLoading={createCommentMutation.isPending}
            form="create-comment"
            type="submit"
            size="sm"
            disabled={createCommentMutation.isPending}
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
            <Textarea
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
