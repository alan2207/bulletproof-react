/**
 * Types shared by the API layer across features.
 * Feature-specific response shapes belong in `src/features/<name>/types`.
 */
export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};
