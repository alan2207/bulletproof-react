import { PlusIcon } from '@heroicons/react/outline';

import { Button } from '@/components/Elements';
import { Form, MDField } from '@/components/Form';
import { FormDrawer } from '@/components/Form/FormDrawer';

import { useCreateComment } from '../hooks/useCreateComment';

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
        size="xl"
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
        <Form<{ body: string }>
          id="create-comment"
          onSubmit={async (values) => {
            await createCommentMutation.mutateAsync({
              data: {
                body: values.body,
                discussionId,
              },
            });
          }}
        >
          {({ control, formState }) => (
            <MDField name="body" control={control} error={formState.errors['body']} label="Body" />
          )}
        </Form>
      </FormDrawer>
    </>
  );
};
