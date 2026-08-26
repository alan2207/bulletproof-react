# API Layer — Full Patterns

SKILL.md carries the canonical query and mutation exemplars. This file has the supporting infrastructure and the less-common variants.

## Single API client — `src/lib/api-client.ts`

One pre-configured instance for the entire app. Interceptors centralize the concerns every request shares — auth, response unwrapping, error notification, 401 handling:

```ts
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);
```

Because the response interceptor returns `response.data`, fetcher functions are typed as `Promise<Discussion>` — not `Promise<AxiosResponse<Discussion>>` — and components never see transport details.

## react-query config + helper types — `src/lib/react-query.ts`

The helper types are what make every API hook configurable without per-endpoint generics. They infer request/response types from the fetcher function itself:

```ts
import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
```

- `QueryConfig<typeof getXQueryOptions>` = everything a caller may override on a query except `queryKey`/`queryFn`.
- `MutationConfig<typeof createX>` = full `UseMutationOptions` with data/variables inferred from the fetcher.

## Query keys live in one place

The exported `queryOptions` factory is the single source of truth for a query's key. Everything else derives from it:

- **Prefetch in a route loader:** read the cache first, fetch on a miss — `queryClient.getQueryData(q.queryKey) ?? (await queryClient.fetchQuery(q))` where `q = getDiscussionQueryOptions(id)` (full loader example in `app-setup.md`).
- **Prefetch on likely navigation** (e.g. hovering a list row): `queryClient.prefetchQuery(getDiscussionQueryOptions(id))`.
- **Invalidate after a mutation:** `queryClient.invalidateQueries({ queryKey: getDiscussionsQueryOptions().queryKey })`.
- **Read from cache:** `queryClient.getQueryData(getDiscussionQueryOptions(id).queryKey)`.

If a query key ever appears as a hand-typed array literal outside its own `queryOptions` factory, that's a bug waiting for a rename.

## Infinite query variant

Same shape, `infiniteQueryOptions` instead (verbatim from `features/comments/api/get-comments.ts`):

```ts
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Comment, Meta } from '@/types/api';

export const getComments = ({
  discussionId,
  page = 1,
}: {
  discussionId: string;
  page?: number;
}): Promise<{ data: Comment[]; meta: Meta }> => {
  return api.get(`/comments`, {
    params: {
      discussionId,
      page,
    },
  });
};

export const getInfiniteCommentsQueryOptions = (discussionId: string) => {
  return infiniteQueryOptions({
    queryKey: ['comments', discussionId],
    queryFn: ({ pageParam = 1 }) => {
      return getComments({ discussionId, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.page === lastPage?.meta?.totalPages) return undefined;
      const nextPage = lastPage.meta.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseCommentsOptions = {
  discussionId: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getComments>;
};

export const useInfiniteComments = ({ discussionId }: UseCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommentsQueryOptions(discussionId),
  });
};
```

## Checklist for any new endpoint file

One file per endpoint under the owning feature's `api/` folder, containing:

1. Input types — zod schema for mutations (exported, reused by the form), plain types for query params.
2. Fetcher function using the shared `api` client. Typed return; no try/catch (the interceptor handles errors).
3. `queryOptions` / `infiniteQueryOptions` factory (queries only), exported.
4. Hook wrapping the factory/fetcher, accepting `queryConfig` / `mutationConfig`.
5. Mutations invalidate related queries via the factory's `.queryKey` in a default `onSuccess`, and still forward the caller's `onSuccess` (`onSuccess?.(...args)` after invalidation).
