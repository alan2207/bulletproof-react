/**
 * Shapes shared by every endpoint. Per-feature request/response types belong
 * next to the feature that owns them, not here.
 */

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type Entity<T> = T & BaseEntity;

/** Pagination envelope returned by list endpoints. */
export type Meta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: Meta;
};

/**
 * The error body the backend returns on a failed request. Every field is
 * optional on purpose — a 502 from a proxy or a crash in the backend will not
 * respect the contract, and the API client must still produce a sane message.
 */
export type ApiErrorResponse = {
  message?: string;
  error?: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: Record<string, string[]>;
};
