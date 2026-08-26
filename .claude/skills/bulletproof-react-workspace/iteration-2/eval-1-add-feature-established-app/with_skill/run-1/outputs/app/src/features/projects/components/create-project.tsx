import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';

import {
  createProjectInputSchema,
  useCreateProject,
} from '../api/create-project';

export const CreateProject = () => {
  const { addNotification } = useNotifications();
  const createProjectMutation = useCreateProject({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Project Created',
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={createProjectMutation.isSuccess}
      triggerButton={
        <Button size="sm" icon={<Plus className="size-4" />}>
          Create Project
        </Button>
      }
      title="Create Project"
      submitButton={
        <Button
          form="create-project"
          type="submit"
          size="sm"
          isLoading={createProjectMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-project"
        onSubmit={(values) => {
          createProjectMutation.mutate({ data: values });
        }}
        schema={createProjectInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              label="Name"
              error={formState.errors['name']}
              registration={register('name')}
            />

            <Textarea
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
