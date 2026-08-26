import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ZodIssue } from 'zod';

import { Button, Input, Textarea } from '@/components/ui';

import { useCreateTask } from '../api/create-task';
import { createTaskInputSchema, type CreateTaskInput } from '../types';
import styles from './create-task-form.module.css';

type FieldErrors = Partial<Record<keyof CreateTaskInput, string>>;

const EMPTY_FORM: CreateTaskInput = { title: '', description: '' };

const toFieldErrors = (issues: ZodIssue[]) =>
  issues.reduce<FieldErrors>((acc, issue) => {
    const field = issue.path[0] as keyof CreateTaskInput | undefined;
    if (field && !acc[field]) {
      acc[field] = issue.message;
    }
    return acc;
  }, {});

export const CreateTaskForm = () => {
  const [values, setValues] = useState<CreateTaskInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  const createTask = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        setValues(EMPTY_FORM);
        setErrors({});
      },
    },
  });

  const handleChange =
    (field: keyof CreateTaskInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Same schema the API layer uses, so client and server agree on "valid".
    const result = createTaskInputSchema.safeParse(values);

    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    createTask.mutate(result.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        name="title"
        placeholder="Write the release notes"
        value={values.title}
        onChange={handleChange('title')}
        error={errors.title}
        disabled={createTask.isPending}
      />
      <Textarea
        label="Description"
        name="description"
        rows={3}
        placeholder="What needs to happen?"
        value={values.description}
        onChange={handleChange('description')}
        error={errors.description}
        disabled={createTask.isPending}
      />
      {createTask.isError && (
        <p className={styles.formError} role="alert">
          {createTask.error.message}
        </p>
      )}
      <div className={styles.actions}>
        <Button type="submit" isLoading={createTask.isPending}>
          Add task
        </Button>
      </div>
    </form>
  );
};
