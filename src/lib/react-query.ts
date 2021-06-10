import { AxiosError } from 'axios';
import { QueryClient, UseQueryOptions, UseMutationOptions } from 'react-query';
import { PromiseValue } from 'type-fest';

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type QueryConfig<FetcherFnType extends (...args: any) => any> = UseQueryOptions<
  PromiseValue<ReturnType<FetcherFnType>>
>;

export type MutationConfig<FetcherFnType extends (...args: any) => any> = UseMutationOptions<
  PromiseValue<ReturnType<FetcherFnType>>,
  AxiosError,
  Parameters<FetcherFnType>[0]
>;
