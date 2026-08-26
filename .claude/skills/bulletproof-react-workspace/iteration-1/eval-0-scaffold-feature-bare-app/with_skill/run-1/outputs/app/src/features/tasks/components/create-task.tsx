import { Button } from '@/components/ui/button/button';
import { Form } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useNotifications } from '@/components/ui/notifications/notifications-store';
import {
  createTaskInputSchema,
  useCreateTask,
} from '@/features/tasks/api/create-task';

export const CreateTask = () => {
  const { addNotification } = useNotifications();

  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({ type: 'success', title: 'Task created' });
      },
    },
  });

  return (
    <Form
      id="create-task"
      className="create-task"
      schema={createTaskInputSchema}
      onSubmit={(values) => createTaskMutation.mutateAsync({ data: values })}
    >
      {({ errors }) => (
        <>
          <Input
            label="Title"
            name="title"
            placeholder="Ship the thing"
            error={errors.title}
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="What needs to happen?"
            error={errors.description}
          />
          <Button type="submit" isLoading={createTaskMutation.isPending}>
            Create task
          </Button>
        </>
      )}
    </Form>
  );
};
