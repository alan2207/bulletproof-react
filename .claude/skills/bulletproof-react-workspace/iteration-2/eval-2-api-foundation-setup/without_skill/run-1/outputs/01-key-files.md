# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState, type ReactNode } from 'react';

import { Notifications } from '@/components/ui/notifications';
import { createQueryClient } from '@/lib/react-query';

/**
 * Every app-wide provider, in one place. Anything the whole tree needs -
 * data fetching, notifications, and later theming or auth - is wired here so
 * `main.tsx` stays a two-line entry point.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // `useState` with an initialiser, not a module-level singleton: the client is
  // created once per mount, which keeps tests (and future StrictMode/HMR
  // remounts) from sharing a cache across app instances.
  const [queryClient] = useState(createQueryClient);

  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </Suspense>
  );
};
```


## src/app/router.tsx

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { Home } from './routes/home';
import { Login } from './routes/login';
import { NotFound } from './routes/not-found';
import { RootErrorBoundary, RootLayout } from './routes/root';

const router = createBrowserRouter([
  {
    path: paths.home.path,
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: paths.auth.login.path, element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```


## src/config/env.ts

```ts
import { z } from 'zod';

/**
 * Single source of truth for runtime configuration.
 *
 * Every env var the app depends on is declared here and validated once, at
 * module load. A missing or malformed variable fails immediately with a message
 * that names the variable and says how to fix it - instead of surfacing later as
 * a request to `undefined/users` or a blank screen.
 *
 * Only `VITE_`-prefixed variables are exposed to the browser by Vite, so that
 * prefix is part of every name below.
 */

/**
 * Accepts an absolute URL (`https://api.example.com`) or a same-origin path
 * (`/api`), which is the usual shape when the backend sits behind the same
 * origin - the common setup for cookie-based auth, since it avoids third-party
 * cookie restrictions entirely.
 */
const apiUrlSchema = z
  .string({ required_error: 'is required (e.g. https://api.example.com or /api)' })
  .min(1, 'must not be empty')
  .refine(
    (value) => {
      if (value.startsWith('/')) return true;
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message:
        'must be an absolute http(s) URL (https://api.example.com) or a same-origin path (/api)',
    },
  )
  // Trailing slashes double up once axios joins a path onto the base URL.
  .transform((value) => value.replace(/\/+$/, ''));

const EnvSchema = z.object({
  VITE_API_URL: apiUrlSchema,
  VITE_APP_NAME: z.string().min(1, 'must not be empty').default('My App'),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Read each variable explicitly rather than handing zod the whole
 * `import.meta.env` object: Vite performs a static find-and-replace on
 * `import.meta.env.VITE_*` at build time, so explicit reads are the only form
 * guaranteed to survive bundling.
 */
const rawEnv = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
};

const formatIssues = (error: z.ZodError): string =>
  Object.entries(error.flatten().fieldErrors)
    .map(([name, issues]) => `  - ${name}: ${issues?.join('; ') ?? 'is invalid'}`)
    .join('\n');

const parseEnv = (): Env => {
  const parsed = EnvSchema.safeParse(rawEnv);

  if (!parsed.success) {
    throw new Error(
      [
        'Invalid environment configuration.',
        '',
        'The following variables are missing or invalid:',
        formatIssues(parsed.error),
        '',
        'Fix: copy `.env.example` to `.env`, fill in the values, and restart the dev server.',
        'Note: only variables prefixed with `VITE_` are exposed to the browser.',
      ].join('\n'),
    );
  }

  return parsed.data;
};

/**
 * Validated, fully-typed config. Import this - never `import.meta.env` - so
 * every consumer gets values that are known to exist and to be well-formed.
 */
export const env = parseEnv();
```


## src/config/paths.ts

```ts
/**
 * Every route in the app, declared once.
 *
 * `path` is what the router registers; `getHref` is what links and redirects
 * call. Keeping both in one place means a URL change is a single edit, and the
 * API layer can redirect on 401 without hardcoding a string.
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
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
} as const;
```


## src/lib/api-client.ts

```ts
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { notify } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

import { toApiError } from './api-error';

export { ApiError, toApiError } from './api-error';

export type RequestConfig = AxiosRequestConfig & {
  /**
   * Suppress the automatic error toast for this request. Use it when the caller
   * renders the failure itself - inline form validation, a background poll, or
   * a request whose failure is expected and handled.
   */
  skipErrorNotification?: boolean;
};

/**
 * Cookie-based auth: nothing is read from or written to storage in JS, and no
 * Authorization header is attached. The browser sends the session cookie
 * because `withCredentials` is on, which is also what lets the server's
 * `Set-Cookie` stick on the response.
 *
 * The backend must answer with `Access-Control-Allow-Credentials: true` and an
 * explicit origin (a wildcard is rejected by browsers for credentialed
 * requests) unless `VITE_API_URL` is a same-origin path such as `/api`.
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
});

const redirectToLogin = () => {
  const { pathname, search } = window.location;

  // Already on the login screen - redirecting again would only clobber the
  // `redirectTo` we captured the first time.
  if (pathname.startsWith(paths.auth.login.path)) return;

  // A full-page assign rather than a router navigation, deliberately: the
  // session is gone, so every cache still in memory is suspect. Reloading
  // starts from a clean slate, and it works from non-React code like this.
  window.location.assign(paths.auth.login.getHref(`${pathname}${search}`));
};

// `error.config` is typed as axios' internal config, which does not know about
// our custom flag - but axios does carry unknown config keys through untouched.
const shouldNotify = (config: unknown): boolean =>
  !(config as RequestConfig | undefined)?.skipErrorNotification;

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);

    // The single place where a failed request becomes visible to the user, so
    // no feature has to remember to wire up its own `onError`.
    if (shouldNotify(axios.isAxiosError(error) ? error.config : undefined)) {
      notify.error({ title: 'Request failed', message: apiError.message });
    }

    if (apiError.isUnauthorized) {
      redirectToLogin();
    }

    // Reject with the normalised error so react-query and every caller can rely
    // on receiving an `ApiError`.
    return Promise.reject(apiError);
  },
);

/**
 * Thin, typed wrapper over the axios instance.
 *
 * It unwraps `response.data`, so API functions read as `Promise<User>` instead
 * of `Promise<AxiosResponse<User>>`, while still accepting per-request options
 * (`params`, `signal`, `skipErrorNotification`).
 *
 * ```ts
 * export const getUser = (userId: string, config?: RequestConfig) =>
 *   api.get<User>(`/users/${userId}`, config);
 * ```
 */
export const api = {
  get: <TData>(url: string, config?: RequestConfig): Promise<TData> =>
    apiClient.get<TData>(url, config).then((response) => response.data),

  post: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.post<TData>(url, data, config).then((response) => response.data),

  put: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.put<TData>(url, data, config).then((response) => response.data),

  patch: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.patch<TData>(url, data, config).then((response) => response.data),

  delete: <TData>(url: string, config?: RequestConfig): Promise<TData> =>
    apiClient.delete<TData>(url, config).then((response) => response.data),
};
```


## src/lib/api-error.ts

```ts
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
```


## src/lib/react-query.ts

```ts
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
```


## .eslintrc.cjs

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Configuration has exactly one entry point. Reading `import.meta.env`
    // directly skips validation and defaults, which is how a missing variable
    // turns into a mysterious `undefined` at runtime.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MemberExpression[object.type="MetaProperty"][property.name="env"]',
        message:
          'Import the validated `env` object from `@/config/env` instead of reading `import.meta.env` directly.',
      },
    ],
  },
  overrides: [
    {
      // The one module allowed to read the raw environment.
      files: ['src/config/env.ts', 'vite.config.ts'],
      rules: { 'no-restricted-syntax': 'off' },
    },
  ],
};
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
    // Mirrors the `@/*` -> `./src/*` mapping in tsconfig.json, so imports stay
    // stable no matter how deeply nested the importing file is.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
