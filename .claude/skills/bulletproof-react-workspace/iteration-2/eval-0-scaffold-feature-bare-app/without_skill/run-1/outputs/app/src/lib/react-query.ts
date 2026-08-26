import {
  QueryClient,
  type DefaultOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 60 * 1000,
  },
} satisfies DefaultOptions;

export const createQueryClient = () =>
  new QueryClient({ defaultOptions: queryConfig });

type AsyncApiFn = (...args: never[]) => Promise<unknown>;

export type ApiFnReturnType<FnType extends AsyncApiFn> = Awaited<
  ReturnType<FnType>
>;

/**
 * Everything a caller may override on a `queryOptions` factory — the key and
 * the fetcher stay owned by the feature.
 *
 *   useTasks({ queryConfig: { enabled: isOpen } })
 */
export type QueryConfig<T extends (...args: never[]) => unknown> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

/**
 * Same idea for mutations: callers pass `onSuccess` / `onError` without the
 * hook having to re-declare its data and variable types.
 */
export type MutationConfig<MutationFnType extends AsyncApiFn> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
  >;
