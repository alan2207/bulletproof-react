/* eslint-disable @typescript-eslint/no-explicit-any -- these helper types must
   accept arbitrary fetcher signatures in order to infer from them. */
import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

/**
 * Defaults applied to every query in the app.
 *
 * - `refetchOnWindowFocus: false` — refetching on every tab focus is noisy and
 *   surprises users far more often than it helps.
 * - `retry: false` — the error interceptor already notifies; silent retries
 *   only delay the feedback. Opt back in per query via `queryConfig`.
 * - `staleTime: 60s` — avoids a refetch storm when several components mount
 *   against the same key.
 */
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

/**
 * Everything a caller may override on a query — except the parts that define
 * the query's identity (`queryKey`) and how it fetches (`queryFn`).
 */
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

/**
 * Full `UseMutationOptions` with data and variables inferred from the fetcher,
 * so no endpoint has to hand-write generics.
 */
export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
