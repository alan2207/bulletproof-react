import { z } from 'zod';

/**
 * Fields every entity returned by the API carries. Feature schemas extend
 * this so ids and timestamps stay consistent across the app.
 */
export const entitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type Entity = z.infer<typeof entitySchema>;

/** Pagination envelope used by list endpoints that support it. */
export const metaSchema = z.object({
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Meta = z.infer<typeof metaSchema>;
