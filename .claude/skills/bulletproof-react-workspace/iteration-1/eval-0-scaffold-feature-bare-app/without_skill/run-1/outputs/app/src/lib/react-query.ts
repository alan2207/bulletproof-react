import type { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

/** The awaited return type of an API function. */
export type ApiFnReturnType<TFn extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<TFn>>;

/**
 * Options a caller may override on a query hook, minus the parts the hook
 * owns (`queryKey` / `queryFn`).
 *
 * Usage: `type Options = { queryConfig?: QueryConfig<typeof getTasksQueryOptions> }`
 */
export type QueryConfig<TOptionsFn extends (...args: never[]) => unknown> = Omit<
  ReturnType<TOptionsFn>,
  'queryKey' | 'queryFn'
>;

/**
 * Options a caller may override on a mutation hook. The hook still owns
 * `mutationFn`, so features only pass `onSuccess` / `onError` and friends.
 */
export type MutationConfig<
  TFn extends (...args: never[]) => Promise<unknown>,
> = UseMutationOptions<ApiFnReturnType<TFn>, Error, Parameters<TFn>[0]>;
