import { ChangeEvent, FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/form';
import { notificationsStore } from '@/components/ui/notifications';

import {
  CreateTaskInput,
  createTaskInputSchema,
  useCreateTask,
} from '../api/create-task';

import styles from './tasks.module.css';

const emptyValues: CreateTaskInput = { title: '', description: '' };

type FieldErrors = Partial<Record<keyof CreateTaskInput, string>>;

export const CreateTask = () => {
  const [values, setValues] = useState<CreateTaskInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        setValues(emptyValues);
        setErrors({});
        notificationsStore.addNotification({
          type: 'success',
          title: 'Task created',
        });
      },
    },
  });

  const handleChange =
    (field: keyof CreateTaskInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Same schema the request is typed from, so client and server validation
    // can't drift apart.
    const result = createTaskInputSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
      });
      return;
    }

    setErrors({});
    createTaskMutation.mutate({ data: result.data });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        name="title"
        value={values.title}
        error={errors.title}
        onChange={handleChange('title')}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        error={errors.description}
        onChange={handleChange('description')}
      />
      <div>
        <Button type="submit" isLoading={createTaskMutation.isPending}>
          Create task
        </Button>
      </div>
    </form>
  );
};
