/* eslint-disable @typescript-eslint/no-explicit-any -- the generic helpers below
   need `any` in constraint position so they accept API functions of any shape;
   `unknown` would reject every real call site. */

import {
  QueryClient,
  type DefaultOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { ApiError } from './api-error';

export const queryConfig = {
  queries: {
    // Failed requests already raise a toast from the API layer, so a query
    // failing does not need to take the whole screen down as well.
    throwOnError: false,

    // Refetching on every tab focus is a surprising source of load; opt in per
    // query where freshness genuinely matters.
    refetchOnWindowFocus: false,

    // A 4xx means the request itself is wrong - retrying it unchanged just
    // burns time and stacks up errors. Retry transient failures only.
    retry: (failureCount: number, error: unknown) => {
      if (error instanceof ApiError && error.isClientError) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10_000),

    // Data is considered fresh for a minute, then refetched in the background
    // on the next mount - fast navigation without serving stale data forever.
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  mutations: {
    // Mutations are rarely idempotent; a silent retry can double-charge.
    retry: false,
  },
} satisfies DefaultOptions;

/**
 * One `QueryClient` per app instance, created lazily so tests can spin up an
 * isolated cache instead of sharing a module-level singleton.
 */
export const createQueryClient = () => new QueryClient({ defaultOptions: queryConfig });

/** The resolved data type of an API function, e.g. `ApiFnReturnType<typeof getUser>`. */
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

/**
 * The options a caller may override on a query hook - everything except the
 * `queryKey`/`queryFn` the hook owns. Used as:
 *
 * ```ts
 * type UseUserOptions = { userId: string; queryConfig?: QueryConfig<typeof getUserQueryOptions> };
 * ```
 */
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

/**
 * The options a caller may pass to a mutation hook (`onSuccess`, `onError`, ...)
 * with the data, error and variables types inferred from the API function.
 */
export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    ApiError,
    Parameters<MutationFnType>[0]
  >;
