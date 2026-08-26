/**
 * All cache keys for this feature in one place, so invalidation stays
 * predictable as more task endpoints are added.
 */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
};
