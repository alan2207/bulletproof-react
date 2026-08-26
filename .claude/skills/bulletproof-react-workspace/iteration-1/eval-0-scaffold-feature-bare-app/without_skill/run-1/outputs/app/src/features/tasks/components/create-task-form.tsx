import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useZodForm } from '@/hooks/use-zod-form';

import {
  createTaskInputSchema,
  useCreateTask,
  type CreateTaskInput,
} from '../api/create-task';

const initialValues: CreateTaskInput = { title: '', description: '' };

type CreateTaskFormProps = {
  onSuccess?: () => void;
};

export const CreateTaskForm = ({ onSuccess }: CreateTaskFormProps) => {
  const createTaskMutation = useCreateTask();

  const form = useZodForm({
    schema: createTaskInputSchema,
    initialValues,
    onSubmit: (data) => {
      createTaskMutation.mutate(
        { data },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        },
      );
    },
  });

  return (
    <form className="form" onSubmit={form.handleSubmit} noValidate>
      <Input
        name="title"
        label="Title"
        placeholder="Ship the tasks page"
        value={form.values.title}
        onChange={form.handleChange}
        error={form.errors.title}
      />
      <Textarea
        name="description"
        label="Description"
        placeholder="What needs to happen?"
        value={form.values.description}
        onChange={form.handleChange}
        error={form.errors.description}
      />
      {createTaskMutation.isError && (
        <p className="callout callout--error" role="alert">
          {createTaskMutation.error.message}
        </p>
      )}
      <Button type="submit" isLoading={createTaskMutation.isPending}>
        Create task
      </Button>
    </form>
  );
};
