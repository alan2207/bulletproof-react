# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications/notifications';
import { Spinner } from '@/components/ui/spinner/spinner';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // The initializer form creates the client exactly once, not on every render.
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <Spinner size={48} />
        </div>
      }
    >
      <ErrorBoundary fallback={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
```


## src/app/router.tsx

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- `convert` adapts route
   modules whose exports are only known at runtime. */
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';

import { paths } from '@/config/paths';

/**
 * Adapts a lazily-imported route module to react-router's shape, handing the
 * `queryClient` to the module's `clientLoader`/`clientAction` factories so
 * routes can prefetch queries before navigation completes.
 */
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

/**
 * Routes are split at the route level — the granularity where code splitting
 * pays for itself. Feature routes are added under `paths.app`.
 */
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);
```


## src/config/env.ts

```ts
import * as z from 'zod';

/**
 * Environment variables are parsed once, at startup, through a zod schema.
 *
 * Vite only exposes variables prefixed with `VITE_`; we use `VITE_APP_` and
 * strip the prefix so the rest of the app reads `env.API_URL`.
 *
 * If anything is missing or malformed the app fails immediately with a message
 * naming the offending variables — instead of misbehaving later with an
 * `undefined` base URL and a pile of confusing 404s.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1, 'Required — the REST API base URL'),
  });

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (key.startsWith('VITE_APP_')) {
        acc[key.replace('VITE_APP_', '')] = value as string;
      }
      return acc;
    },
    {},
  );

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    const issues = Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([key, errors]) => `  - VITE_APP_${key}: ${errors?.join(', ')}`)
      .join('\n');

    throw new Error(
      [
        'Invalid environment configuration.',
        'The following variables are missing or invalid:',
        issues,
        '',
        'Copy `.env.example` to `.env`, fill in the values, and restart the dev server.',
      ].join('\n'),
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
```


## src/config/paths.ts

```ts
/**
 * Single registry of every route in the app.
 *
 * Each entry declares a `path` (consumed by the router) and a `getHref()`
 * (consumed by links and redirects) so URLs are never hand-assembled as
 * strings at call sites. Every new feature adds its routes here.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    // Feature routes are registered here, e.g.
    // discussions: { path: 'discussions', getHref: () => '/app/discussions' },
  },
} as const;
```


## src/lib/api-client.ts

```ts
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

/**
 * Auth is cookie based: the API sets an HttpOnly session cookie that client
 * JavaScript can neither read nor leak. All the client has to do is send
 * credentials with every request.
 */
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrap the payload so fetchers are typed `Promise<Discussion>` rather than
  // `Promise<AxiosResponse<Discussion>>` — components never see transport details.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Every failed call surfaces a notification from one place; individual
    // components and hooks do not try/catch requests.
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      const loginHref = paths.auth.login.getHref(redirectTo);

      // Guard against a redirect loop when the login request itself 401s.
      if (window.location.pathname !== paths.auth.login.path) {
        window.location.href = loginHref;
      }
    }

    return Promise.reject(error);
  },
);
```


## src/lib/react-query.ts

```ts
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
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'check-file'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // Module boundaries. Without these the architecture is convention only.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Disable cross-feature imports. Every new feature MUST add its own
          // entry here, e.g.
          // {
          //   target: './src/features/discussions',
          //   from: './src/features',
          //   except: ['./discussions'],
          // },

          // Enforce a unidirectional codebase: src/app may import from
          // src/features, but never the other way around.
          {
            target: './src/features',
            from: './src/app',
          },
          // Shared modules may not import from features or the app layer.
          {
            target: [
              './src/components',
              './src/hooks',
              './src/lib',
              './src/types',
              './src/utils',
            ],
            from: ['./src/features', './src/app'],
          },
        ],
      },
    ],
    'import/no-cycle': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    // TypeScript already reports unresolved modules; the eslint check is
    // redundant and slower.
    'import/no-unresolved': 'off',

    // kebab-case for every file and folder.
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': [
      'error',
      { 'src/**/!(__tests__)': 'KEBAB_CASE' },
    ],

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```


## tsconfig.json

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
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
    // Mirrors the `@/*` path mapping in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
