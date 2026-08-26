# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // Lazy initializer: the client is created exactly once, not on every render.
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
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
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

/**
 * Adapts a lazily imported route module to react-router's shape. Route modules
 * export `clientLoader`/`clientAction` *factories* that take the queryClient,
 * so loaders can prefetch into the same cache the components read from.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

// Routes are lazy-loaded at the route level — the right code-splitting
// granularity. Feature routes get registered here as they are built.
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = React.useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
```


## src/config/env.ts

```ts
import * as z from 'zod';

/**
 * Environment variables are parsed once, at startup, through a zod schema.
 * A missing or malformed variable fails fast with a readable message instead
 * of surfacing later as `undefined` in a request URL.
 *
 * Convention: every variable is prefixed with `VITE_APP_` in `.env` files and
 * consumed here without the prefix (`VITE_APP_API_URL` -> `env.API_URL`).
 * Nothing else in the app reads `import.meta.env` directly.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1, 'Required'),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
  });

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value as string;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}
Add them to your .env file (prefixed with VITE_APP_) — see .env.example.`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
```


## src/config/paths.ts

```ts
/**
 * Single registry of every route in the app. Routes are declared once with a
 * `path` (for the router) and a `getHref()` (for links and redirects), so URLs
 * are never hand-assembled as strings elsewhere.
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
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
  },
} as const;
```


## src/lib/api-client.ts

```ts
import Axios, { type InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

/**
 * Auth is cookie based: the API sets an HttpOnly session cookie, and the client
 * only has to send credentials along with every request. No token is read or
 * stored by JS, so there is nothing for an XSS payload to exfiltrate.
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
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is why fetchers are typed `Promise<Thing>` rather than
  // `Promise<AxiosResponse<Thing>>` — components never see transport details.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Every failed request notifies once, centrally. Callers don't try/catch.
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);
```


## src/lib/react-query.ts

```ts
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
  plugins: ['react-refresh', 'check-file'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // --- Module boundaries -------------------------------------------------
    // This is what turns the architecture into enforcement rather than
    // convention. EVERY new feature must be added to the cross-feature block
    // below, otherwise it is silently unprotected.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Disable cross-feature imports.
          // One entry per feature, e.g.:
          // {
          //   target: './src/features/discussions',
          //   from: './src/features',
          //   except: ['./discussions'],
          // },

          // Enforce a unidirectional codebase: src/app can import from
          // src/features, but not the other way around.
          {
            target: './src/features',
            from: './src/app',
          },
          // Shared modules may not import from features or app.
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
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
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

    // --- Naming ------------------------------------------------------------
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
  },
  overrides: [
    {
      plugins: ['check-file'],
      files: ['src/**/!(__tests__)/*'],
      rules: {
        'check-file/folder-naming-convention': [
          'error',
          { '**/*': 'KEBAB_CASE' },
        ],
      },
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
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```


## vite.config.ts

```ts
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Matches the `@/*` path mapping in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
