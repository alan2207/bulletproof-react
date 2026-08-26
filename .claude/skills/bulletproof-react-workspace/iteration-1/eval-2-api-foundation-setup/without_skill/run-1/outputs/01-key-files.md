# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main-error-fallback';
import { Notifications } from '@/components/ui/notifications/notifications';
import { queryClient } from '@/lib/react-query';

/**
 * Everything the whole tree needs, in the order it needs it.
 *
 * `Notifications` sits outside the boundary and the suspense fence on purpose:
 * a message about a failed request should still be visible while the app is
 * loading, and after it has crashed.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => (
  <>
    <Notifications />
    <Suspense fallback={null}>
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <MainErrorFallback error={error} reset={reset} />
        )}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  </>
);
```


## src/app/router.tsx

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { HomeRoute } from './routes/home';
import { LoginRoute } from './routes/login';
import { NotFoundRoute } from './routes/not-found';

/**
 * The route table. Paths come from `@/config/paths` so that code outside the
 * router — the 401 handler in the API client, for example — can link to a route
 * without hardcoding its URL.
 */
const router = createBrowserRouter([
  {
    path: paths.home.path,
    element: <HomeRoute />,
  },
  {
    path: paths.auth.login.path,
    element: <LoginRoute />,
  },
  {
    path: '*',
    element: <NotFoundRoute />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```


## src/config/env.ts

```ts
import { z } from 'zod';

/**
 * Runtime configuration.
 *
 * Every environment variable the app is allowed to read is declared in the
 * schema below. Reading `import.meta.env` directly anywhere else is a bug: it
 * bypasses validation and lets a typo or a missing value fail silently, deep
 * inside a feature, long after startup.
 *
 * Instead this module parses the whole environment once, at import time, and
 * throws a single readable error listing exactly what is wrong. `src/main.tsx`
 * catches that error and renders it, so a misconfigured app shows a
 * configuration screen instead of a blank page.
 *
 * To add a variable: add it to the schema, add it to `.env.example`, and add it
 * to `ImportMetaEnv` in `src/vite-env.d.ts`.
 */

/** Vite only exposes variables to the client if they carry this prefix. */
const ENV_PREFIX = 'VITE_';

const EnvSchema = z.object({
  /** Base URL of the REST backend, e.g. `https://api.example.com`. */
  API_URL: z
    .string()
    .url('must be a valid absolute URL, e.g. https://api.example.com'),

  /** How long a request may run before it is aborted, in milliseconds. */
  API_TIMEOUT_MS: z.coerce
    .number()
    .int('must be a whole number of milliseconds')
    .positive('must be greater than 0')
    .default(15_000),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Collects the prefixed variables and strips the prefix, so the schema can talk
 * about `API_URL` while `.env` files keep the `VITE_` convention.
 *
 * A variable that is present but blank (`VITE_API_URL=`) is treated as absent —
 * an empty string is almost never a value someone meant to set, and reporting it
 * as missing is far more useful than reporting it as an invalid URL.
 */
const readRawEnv = (): Record<string, string> => {
  const raw: Record<string, string> = {};

  for (const [key, value] of Object.entries(import.meta.env)) {
    if (!key.startsWith(ENV_PREFIX)) continue;
    if (typeof value !== 'string' || value.trim() === '') continue;

    raw[key.slice(ENV_PREFIX.length)] = value;
  }

  return raw;
};

const formatIssue = (issue: z.ZodIssue): string => {
  const name = `${ENV_PREFIX}${issue.path.join('.')}`;
  const missing = issue.code === 'invalid_type' && issue.received === 'undefined';

  return `  - ${name}: ${missing ? 'is required but was not set' : issue.message}`;
};

const parseEnv = (): Env => {
  const parsed = EnvSchema.safeParse(readRawEnv());

  if (parsed.success) return parsed.data;

  throw new Error(
    [
      'Invalid environment configuration:',
      '',
      parsed.error.issues.map(formatIssue).join('\n'),
      '',
      'Copy .env.example to .env, fill in the values above, and restart the dev',
      `server. Only variables prefixed with "${ENV_PREFIX}" are visible to the app.`,
    ].join('\n'),
  );
};

export const env = parseEnv();
```


## src/config/paths.ts

```ts
/**
 * Every route in the app, in one place.
 *
 * `path` is what the router matches on; `getHref` is what you navigate to.
 * Keeping both here means a URL change is a single edit, and it lets non-router
 * code (like the 401 handler in the API client) redirect without hardcoding
 * strings.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
  },
} as const;
```


## src/lib/api-client.ts

```ts
import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { showNotification } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { type ApiErrorResponse } from '@/types/api';

/**
 * The single HTTP entry point for the app.
 *
 * Features never construct their own axios instance. Everything that has to be
 * true of every request — credentials, timeouts, error reporting, session
 * expiry — is configured once, here.
 */

/** Per-request escape hatches for the automatic error handling. */
type ApiRequestFlags = {
  /**
   * Suppresses the error notification for this request. Use it when the caller
   * renders the failure itself (inline form errors, an empty state, a probe
   * request that is expected to fail).
   */
  skipErrorNotification?: boolean;
  /** Suppresses the redirect to login on a 401. */
  skipAuthRedirect?: boolean;
};

export type ApiRequestConfig = AxiosRequestConfig & ApiRequestFlags;

/**
 * What a failed response body might actually contain. A well-behaved backend
 * sends `ApiErrorResponse`, but a proxy returns an HTML string and a 504 may
 * send nothing at all — the union keeps the narrowing below honest.
 */
type ApiErrorBody = ApiErrorResponse | string | undefined;

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
};

export const apiClient = Axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT_MS,

  // Auth is cookie based: the browser must send the session cookie on every
  // call, including cross-origin ones. This requires the backend to answer with
  // `Access-Control-Allow-Credentials: true` and an explicit origin (not `*`).
  withCredentials: true,

  // Double-submit CSRF protection, which cookie auth generally needs. Axios
  // copies the `XSRF-TOKEN` cookie into the `X-XSRF-TOKEN` header; since 1.6.2
  // it only does so cross-origin when `withXSRFToken` is set. If the backend
  // never sets the cookie this is a no-op — nothing is read, nothing is sent.
  // Rename both to match your backend's convention.
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

apiClient.interceptors.request.use(authRequestInterceptor);

/**
 * `error.config` carries whatever the caller passed, including our own flags,
 * but it is typed as an axios config. Reading it through `unknown` keeps the
 * lookup honest instead of asserting a shape axios never promised.
 */
const readFlags = (config: unknown): ApiRequestFlags => {
  if (typeof config !== 'object' || config === null) return {};

  const { skipErrorNotification, skipAuthRedirect } = config as ApiRequestFlags;
  return { skipErrorNotification, skipAuthRedirect };
};

const MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'The server rejected the request.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'That conflicts with something that already exists.',
  422: 'Some of the submitted values are not valid.',
  429: 'Too many requests. Please wait a moment and try again.',
};

const fallbackMessage = (status: number): string => {
  const known = MESSAGE_BY_STATUS[status];
  if (known) return known;

  return status >= 500
    ? 'Something went wrong on our end. Please try again shortly.'
    : 'The request failed. Please try again.';
};

/**
 * Turns whatever the backend (or the network) produced into one sentence a user
 * can act on. Never surfaces a raw stack trace, an HTML page, or
 * `[object Object]`.
 */
const getErrorMessage = (error: AxiosError<ApiErrorBody>): string => {
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The request took too long and was cancelled. Please try again.';
  }

  if (!error.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;

  // A plain-text error body is usable; a gateway's HTML error page is not.
  if (typeof data === 'string') {
    const text = data.trim();

    return text !== '' && !text.startsWith('<') ? text : fallbackMessage(status);
  }

  const fieldErrors = data?.errors;
  const firstFieldError = fieldErrors
    ? Object.values(fieldErrors)
        .flat()
        .find((message) => typeof message === 'string' && message.trim() !== '')
    : undefined;

  return (
    data?.message ?? data?.error ?? firstFieldError ?? fallbackMessage(status)
  );
};

const redirectToLogin = () => {
  const { pathname, search } = window.location;

  // Guard against a redirect loop when the login page itself 401s.
  if (pathname.startsWith(paths.auth.login.path)) return;

  window.location.href = paths.auth.login.getHref(`${pathname}${search}`);
};

apiClient.interceptors.response.use(
  // Unwrap the envelope so callers get the payload, not an `AxiosResponse`.
  // The `api` facade below re-types the methods to match.
  (response) => response.data,

  (error: AxiosError<ApiErrorBody>) => {
    // React Query aborts in-flight queries on unmount and on refetch. Those are
    // not failures and must never reach the user.
    if (Axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const flags = readFlags(error.config);
    const status = error.response?.status;

    // A 401 means the session is gone. Bounce to login instead of showing a
    // toast the user cannot do anything about.
    if (status === 401) {
      if (!flags.skipAuthRedirect) redirectToLogin();
      return Promise.reject(error);
... (truncated at 160 lines)
```


## src/lib/react-query.ts

```ts
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
```


## tsconfig.json

```js
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Absolute imports: `@/lib/api-client` instead of `../../../lib/api-client`.
       Keep in sync with `resolve.alias` in vite.config.ts. */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```


## vite.config.ts

```ts
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirrors `compilerOptions.paths` in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
