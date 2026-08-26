# New App Setup (react + vite)

Boilerplate for a fresh bulletproof-react application. Everything here goes in once, at setup time, and every feature scaffolded later plugs into it.

## tsconfig — absolute imports

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

One alias, `@/*`, is enough — short, unambiguous versus node_modules, and files can move without import rewrites. (Vite also needs the matching `resolve.alias` in `vite.config.ts` or `vite-tsconfig-paths`.)

## Validated env — `src/config/env.ts`

Environment variables are parsed once through a zod schema at startup; the app fails fast with a readable message instead of misbehaving at runtime:

```ts
import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
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
      acc[key.replace('VITE_APP_', '')] = value;
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
  .join('\n')}`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
```

The rest of the app imports `env` from here — never `import.meta.env` directly.

## Paths registry — `src/config/paths.ts`

Every route is declared once with its `path` (for the router) and a `getHref()` (for links). No string-assembled URLs anywhere else:

```ts
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/app/discussions',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string) => `/app/discussions/${id}`,
    },
  },
} as const;
```

## Provider composition — `src/app/provider.tsx`

Global providers wrap the app once, ordered so failures are catchable: Suspense → ErrorBoundary → QueryClientProvider → app-specific loaders:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/ui/spinner';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
```

Note the `useState(() => new QueryClient(...))` initializer — the client is created exactly once, not on every render.

## Router with code splitting — `src/app/router.tsx`

Routes are lazy-loaded at the route level (the right granularity — split further and the request count hurts more than the bundle size helps). Route modules export `clientLoader`/`clientAction` factories that receive the `queryClient`, adapted by a small `convert` helper:

```tsx
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';

import { paths } from '@/config/paths';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: paths.app.discussions.path,
          lazy: () =>
            import('./routes/app/discussions/discussions').then(
              convert(queryClient),
            ),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);
```

A route module can then prefetch through its loader. The reference pattern reads the cache first and only fetches on a miss (`getQueryData ?? fetchQuery`), so client-side navigations back to a warm route don't refetch:

```tsx
export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const discussionId = params.discussionId as string;

    const discussionQuery = getDiscussionQueryOptions(discussionId);
    const commentsQuery = getInfiniteCommentsQueryOptions(discussionId);

    const promises = [
      queryClient.getQueryData(discussionQuery.queryKey) ??
        (await queryClient.fetchQuery(discussionQuery)),
      queryClient.getQueryData(commentsQuery.queryKey) ??
        (await queryClient.fetchInfiniteQuery(commentsQuery)),
    ] as const;

    const [discussion, comments] = await Promise.all(promises);

    return { discussion, comments };
  };
```

## ESLint — module boundaries and consistency

The full ruleset that turns the architecture from convention into enforcement (`.eslintrc.cjs`). The three rule groups that matter most:

**1. Module boundary zones** — one zone per feature (cross-feature ban) plus the unidirectional zones. Every new feature must be added here:

```js
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      // disables cross-feature imports:
      // eg. src/features/discussions should not import from src/features/comments, etc.
      {
        target: './src/features/auth',
        from: './src/features',
        except: ['./auth'],
      },
      {
        target: './src/features/discussions',
        from: './src/features',
        except: ['./discussions'],
      },
      // ...one entry per feature, always

      // enforce unidirectional codebase:
      // e.g. src/app can import from src/features but not the other way around
      {
        target: './src/features',
        from: './src/app',
      },
      // shared modules may not import from features or app
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
```

**2. Import order** — grouped and alphabetized, blank line between groups:

```js
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
```

**3. Naming conventions** — kebab-case everywhere (`ignoreMiddleExtensions` keeps `smoke.spec.ts` legal). The filename rule lives with the main TS/TSX override:

```js
'check-file/filename-naming-convention': [
  'error',
  { '**/*.{ts,tsx}': 'KEBAB_CASE' },
  { ignoreMiddleExtensions: true },
],
```

The folder rule is its own override entry — the `files` glob (`!(__tests__)`) is what exempts `__tests__` folders, not the rule pattern:

```js
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
```

Recommended base extends: `@typescript-eslint/recommended`, `react/recommended`, `react-hooks/recommended`, `jsx-a11y/recommended`, `import/errors|warnings|typescript`, `prettier/recommended`, plus `testing-library/react`, `jest-dom/recommended`, `vitest` if testing is set up, and `tailwindcss/recommended` if the app styles with tailwind.

## TypeScript

TypeScript's payoff is refactoring confidence: when changing a domain shape, update the type declarations first, then chase the resulting compiler errors across the project — the checker walks you to every affected site. Keep in mind that type checking happens at build time only; it does not prevent runtime failures (which is why the env schema and API input schemas are zod, checked at runtime).

## Prettier + Husky

- `.prettierrc` with format-on-save; prettier runs through ESLint (`plugin:prettier/recommended`).
- Husky pre-commit hook running lint + type-check (the reference app runs `yarn lint` and `yarn check-types` via lint-staged), so faulty commits never land. Tests are left to CI — too slow for a commit hook.
