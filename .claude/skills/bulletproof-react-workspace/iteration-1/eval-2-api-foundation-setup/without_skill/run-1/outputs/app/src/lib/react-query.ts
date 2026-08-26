import {
  QueryClient,
  type DefaultOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';

/**
 * React Query defaults.
 *
 * Note what is *not* here: global `onError` handlers. Failed requests are
 * reported once, by the axios interceptor in `api-client.ts`. Adding error
 * handling here as well would show every failure twice.
 */

const MAX_RETRIES = 2;

/**
 * Retrying a 4xx is pointless — the request was wrong and will be wrong again.
 * 408 and 429 are the exceptions: both explicitly mean "try again".
 */
const shouldRetry = (failureCount: number, error: Error) => {
  if (failureCount >= MAX_RETRIES) return false;

  if (isAxiosError(error)) {
    const status = error.response?.status;

    // No response at all: a network blip, worth retrying.
    if (status === undefined) return true;
    if (status === 408 || status === 429) return true;
    if (status >= 400 && status < 500) return false;
  }

  return true;
};

export const queryConfig = {
  queries: {
    // Errors are surfaced through `query.error` and the notification raised by
    // the API client. Flip this per-query when a boundary should catch instead.
    throwOnError: false,

    // Refetching every time the user alt-tabs is noisy and expensive; explicit
    // invalidation after a mutation is the intended way to stay fresh.
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // Long enough that navigating back to a screen is instant, short enough
    // that data does not visibly rot. Override per-query where it matters.
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    retry: shouldRetry,
  },
  mutations: {
    // A mutation is not safe to replay blindly — it may have already applied.
    retry: false,
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

/**
 * Helpers for typing feature-level query and mutation hooks.
 *
 * The pattern they support: write the API function and its `queryOptions`
 * factory, then let the hook borrow both types instead of restating them.
 *
 * ```ts
 * export const getUser = ({ userId }: { userId: string }) =>
 *   api.get<User>(`/users/${userId}`);
 *
 * export const getUserQueryOptions = (userId: string) =>
 *   queryOptions({ queryKey: ['users', userId], queryFn: () => getUser({ userId }) });
 *
 * type UseUserOptions = {
 *   userId: string;
 *   queryConfig?: QueryConfig<typeof getUserQueryOptions>;
 * };
 * ```
 */

/** The resolved payload of an API function, with the promise unwrapped. */
export type ApiFnReturnType<
  TFn extends (...args: never[]) => Promise<unknown>,
> = Awaited<ReturnType<TFn>>;

/** Everything a caller may override on a query, minus what the factory owns. */
export type QueryConfig<TFn extends (...args: never[]) => unknown> = Omit<
  ReturnType<TFn>,
  'queryKey' | 'queryFn'
>;

/** Mutation options pre-filled with the data, error, and variables types. */
export type MutationConfig<
  TFn extends (...args: never[]) => Promise<unknown>,
> = UseMutationOptions<ApiFnReturnType<TFn>, Error, Parameters<TFn>[0]>;
