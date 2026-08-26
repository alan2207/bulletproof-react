import { z } from 'zod';

import { entitySchema } from '@/types/api';

/**
 * The shape the API promises for a task. Responses are parsed against this
 * at the API boundary, so a backend change surfaces as one clear error
 * instead of an `undefined` three components deep.
 */
export const taskSchema = entitySchema.extend({
  title: z.string(),
  description: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
