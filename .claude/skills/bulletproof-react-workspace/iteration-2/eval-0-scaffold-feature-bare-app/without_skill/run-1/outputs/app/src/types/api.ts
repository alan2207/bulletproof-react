import { z } from 'zod';

/**
 * Shapes that are true of *every* resource the API returns. Feature-specific
 * schemas extend this rather than redeclaring `id` / `createdAt`.
 */
export const baseEntitySchema = z.object({
  // Some backends hand back numeric ids; normalise to string at the boundary.
  id: z.union([z.string(), z.number()]).transform((value) => String(value)),
  createdAt: z.string().optional(),
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;

/** Error payload convention shared by all endpoints. */
export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};
