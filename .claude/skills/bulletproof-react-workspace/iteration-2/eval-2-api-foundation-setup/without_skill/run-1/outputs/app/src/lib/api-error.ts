import axios, { type AxiosError } from 'axios';

/**
 * A normalised error for every failed request.
 *
 * Callers (react-query, error boundaries, forms) get one predictable shape with
 * a message that is safe to show a user, instead of having to dig through
 * `error.response.data` and guess at the backend's error envelope.
 */
export class ApiError extends Error {
  /** HTTP status, or `undefined` when the request never reached the server. */
  readonly status?: number;
  /** Axios/browser error code, e.g. `ECONNABORTED`, `ERR_NETWORK`. */
  readonly code?: string;
  /** The raw response body, for callers that need field-level detail. */
  readonly data?: unknown;
  /** The original error, kept for logging. */
  readonly cause?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; data?: unknown; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.data = options.data;
    this.cause = options.cause;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** 4xx: the request itself is wrong, so retrying it unchanged won't help. */
  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status !== undefined && this.status >= 500;
  }

  /** No response at all - offline, DNS failure, CORS, or a timeout. */
  get isNetworkError(): boolean {
    return this.status === undefined;
  }
}

/**
 * Best-effort extraction of a human-readable message from a backend error body.
 * Covers the common REST envelopes; unknown shapes fall through to the
 * status-based defaults below.
 */
const getMessageFromBody = (data: unknown): string | undefined => {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    // An HTML error page is not a message worth showing.
    return trimmed && !trimmed.startsWith('<') ? trimmed : undefined;
  }

  if (typeof data !== 'object' || data === null) return undefined;

  const body = data as {
    message?: unknown;
    error?: unknown;
    detail?: unknown;
    errors?: unknown;
  };

  for (const candidate of [body.message, body.error, body.detail]) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }

  if (Array.isArray(body.errors)) {
    const messages = body.errors
      .map((issue): string | undefined => {
        if (typeof issue === 'string') return issue;
        const message = (issue as { message?: unknown } | null)?.message;
        return typeof message === 'string' ? message : undefined;
      })
      .filter((message): message is string => Boolean(message?.trim()));

    if (messages.length > 0) return messages.join(' ');
  }

  return undefined;
};

const getFallbackMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  if (!error.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  const { status } = error.response;

  switch (status) {
    case 400:
      return 'The request was invalid.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That conflicts with the current state of the data. Refresh and try again.';
    case 422:
      return 'Some of the information you submitted was invalid.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return status >= 500
        ? 'Something went wrong on our end. Please try again later.'
        : 'The request failed.';
  }
};

/** Convert anything thrown by axios (or by us) into an `ApiError`. */
export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    return new ApiError(getMessageFromBody(error.response?.data) ?? getFallbackMessage(error), {
      status: error.response?.status,
      code: error.code,
      data: error.response?.data,
      cause: error,
    });
  }

  return new ApiError(error instanceof Error ? error.message : 'An unexpected error occurred.', {
    cause: error,
  });
};
