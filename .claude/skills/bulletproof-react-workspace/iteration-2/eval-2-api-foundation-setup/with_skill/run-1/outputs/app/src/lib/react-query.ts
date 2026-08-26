import {
  type DefaultOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

/**
 * Defaults applied to every query in the app.
 *
 * - `refetchOnWindowFocus: false` — refetching on every tab focus is rarely
 *   what you want and makes request volume unpredictable.
 * - `retry: false` — the api-client already notifies on failure; silent retries
 *   would delay that feedback and hide real errors.
 * - `staleTime: 60s` — data is considered fresh for a minute, so navigating
 *   back to a screen doesn't refire the same request.
 *
 * Any endpoint that needs different behaviour overrides it through the
 * `queryConfig` / `mutationConfig` escape hatch on its hook.
 */
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

/**
 * Helpers that let every API hook be configurable without hand-written
 * generics per endpoint — the types are inferred from the fetcher itself.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
