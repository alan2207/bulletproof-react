import { z } from 'zod';

import { baseEntitySchema } from '@/types/api';

/**
 * The feature's contract with the outside world.
 *
 * Schemas are the source of truth and the types are inferred from them, so the
 * runtime check at the API boundary and the compile-time type can never drift.
 */
export const taskSchema = baseEntitySchema.extend({
  title: z.string(),
  description: z.string(),
});

export const tasksSchema = z.array(taskSchema);

export type Task = z.infer<typeof taskSchema>;

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or fewer'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
