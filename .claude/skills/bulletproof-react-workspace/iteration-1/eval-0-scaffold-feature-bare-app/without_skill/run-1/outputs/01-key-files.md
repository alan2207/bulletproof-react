# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main-error-fallback';
import { Spinner } from '@/components/ui/spinner/spinner';
import { queryConfig } from '@/lib/react-query';

/**
 * Every app-wide provider lives here, so `app/router.tsx` and the feature
 * code below it never need to know what is wired at the root.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <Suspense
      fallback={
        <div className="center center--screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
```


## src/app/router.tsx

```tsx
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';

import { RouteError } from '@/components/errors/route-error';
import { MainLayout } from '@/components/layouts/main-layout';
import { paths } from '@/config/paths';

/**
 * Routes are code-split with `lazy`, so a new feature adds to the bundle
 * only for the people who visit it. The query client is threaded in so
 * loaders can prefetch into the same cache the components read from.
 */
const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <MainLayout />,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          element: <Navigate to={paths.tasks.getHref()} replace />,
        },
        {
          path: paths.tasks.path,
          lazy: async () => {
            const { TasksRoute, tasksLoader } = await import(
              '@/app/routes/tasks'
            );
            return { Component: TasksRoute, loader: tasksLoader(queryClient) };
          },
          errorElement: <RouteError />,
        },
        {
          path: paths.notFound.path,
          lazy: async () => {
            const { NotFoundRoute } = await import('@/app/routes/not-found');
            return { Component: NotFoundRoute };
          },
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
```


## src/config/env.ts

```ts
import { z } from 'zod';

/**
 * Runtime-validated environment configuration.
 *
 * Nothing in the app should read `import.meta.env` directly - import `env`
 * from here instead. That keeps every environment variable in one place and
 * fails loudly at startup instead of silently producing `undefined` deep
 * inside a request.
 */
const EnvSchema = z.object({
  API_URL: z.string().url(),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const createEnv = () => {
  const envVars = {
    API_URL: import.meta.env.VITE_APP_API_URL,
    APP_ENV: import.meta.env.VITE_APP_ENV,
  };

  const parsed = EnvSchema.safeParse(envVars);

  if (!parsed.success) {
    throw new Error(
      [
        'Invalid environment variables:',
        ...Object.entries(parsed.error.flatten().fieldErrors).map(
          ([key, errors]) => `  - VITE_APP_${key}: ${errors?.join(', ')}`,
        ),
        '',
        'Copy .env.example to .env and fill in the missing values.',
      ].join('\n'),
    );
  }

  return parsed.data;
};

export const env = createEnv();
```


## src/config/paths.ts

```ts
/**
 * Single source of truth for every route in the app.
 *
 * Components link with `paths.tasks.getHref()` rather than a hand-written
 * string, so renaming a URL is a one-line change and TypeScript points at
 * every call site that needs new params.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  tasks: {
    path: '/tasks',
    getHref: () => '/tasks',
  },
  notFound: {
    path: '*',
    getHref: () => '/404',
  },
} as const;
```


## src/features/tasks/api/create-task.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { getTasksQueryOptions } from './get-tasks';
import { taskSchema, type Task } from '../types/task';

/**
 * Validates the create-task form *and* types the POST body - one schema,
 * so the form can never submit a payload the API would reject.
 */
export const createTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or fewer'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = async ({
  data,
}: {
  data: CreateTaskInput;
}): Promise<Task> => {
  const response = await api.post<unknown>('/tasks', data);
  return taskSchema.parse(response);
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({
  mutationConfig,
}: UseCreateTaskOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTasksQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    mutationFn: createTask,
  });
};
```


## src/features/tasks/api/get-tasks.ts

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import { taskSchema, type Task } from '../types/task';

export const getTasks = async (): Promise<Task[]> => {
  const data = await api.get<unknown>('/tasks');
  return z.array(taskSchema).parse(data);
};

/**
 * Exported separately from the hook so route loaders can prefetch the same
 * query with the same key.
 */
export const getTasksQueryOptions = () =>
  queryOptions({
    queryKey: ['tasks'] as const,
    queryFn: getTasks,
  });

type UseTasksOptions = {
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

export const useTasks = ({ queryConfig }: UseTasksOptions = {}) =>
  useQuery({
    ...getTasksQueryOptions(),
    ...queryConfig,
  });
```


## src/features/tasks/components/create-task-form.tsx

```tsx
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useZodForm } from '@/hooks/use-zod-form';

import {
  createTaskInputSchema,
  useCreateTask,
  type CreateTaskInput,
} from '../api/create-task';

const initialValues: CreateTaskInput = { title: '', description: '' };

type CreateTaskFormProps = {
  onSuccess?: () => void;
};

export const CreateTaskForm = ({ onSuccess }: CreateTaskFormProps) => {
  const createTaskMutation = useCreateTask();

  const form = useZodForm({
    schema: createTaskInputSchema,
    initialValues,
    onSubmit: (data) => {
      createTaskMutation.mutate(
        { data },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        },
      );
    },
  });

  return (
    <form className="form" onSubmit={form.handleSubmit} noValidate>
      <Input
        name="title"
        label="Title"
        placeholder="Ship the tasks page"
        value={form.values.title}
        onChange={form.handleChange}
        error={form.errors.title}
      />
      <Textarea
        name="description"
        label="Description"
        placeholder="What needs to happen?"
        value={form.values.description}
        onChange={form.handleChange}
        error={form.errors.description}
      />
      {createTaskMutation.isError && (
        <p className="callout callout--error" role="alert">
          {createTaskMutation.error.message}
        </p>
      )}
      <Button type="submit" isLoading={createTaskMutation.isPending}>
        Create task
      </Button>
    </form>
  );
};
```


## src/features/tasks/components/tasks-list.tsx

```tsx
import { Spinner } from '@/components/ui/spinner/spinner';
import { useTasks } from '../api/get-tasks';

export const TasksList = () => {
  const tasksQuery = useTasks();

  if (tasksQuery.isPending) {
    return (
      <div className="center">
        <Spinner label="Loading tasks" />
      </div>
    );
  }

  if (tasksQuery.isError) {
    return (
      <p className="callout callout--error" role="alert">
        Could not load tasks: {tasksQuery.error.message}
      </p>
    );
  }

  const tasks = tasksQuery.data;

  if (tasks.length === 0) {
    return <p className="callout">No tasks yet. Create your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-card">
          <h3 className="task-card__title">{task.title}</h3>
          <p className="task-card__description">{task.description}</p>
        </li>
      ))}
    </ul>
  );
};
```


## src/features/tasks/types/task.ts

```ts
import { z } from 'zod';

import { entitySchema } from '@/types/api';

/**
 * The shape the API promises for a task. Responses are parsed against this
 * at the API boundary, so a backend change surfaces as one clear error
 * instead of an `undefined` three components deep.
 */
export const taskSchema = entitySchema.extend({
  title: z.string(),
  description: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
```


## src/lib/api-client.ts

```ts
import Axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';

/**
 * Normalised error thrown by every request that fails.
 *
 * Feature code should never have to know that axios exists: it catches
 * `ApiError` and reads `message` / `status`.
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, options?: { status?: number; data?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.data = options?.data;
  }
}

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  // Cookie-based sessions; swap for an Authorization header if the API
  // moves to bearer tokens.
  config.withCredentials = true;
  return config;
};

const axiosInstance = Axios.create({
  baseURL: env.API_URL,
});

axiosInstance.interceptors.request.use(requestInterceptor);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';

    return Promise.reject(
      new ApiError(message, {
        status: error.response?.status,
        data: error.response?.data,
      }),
    );
  },
);

/**
 * Thin, typed wrapper around the axios instance.
 *
 * It unwraps `response.data` so call sites read as `const tasks = await
 * api.get<Task[]>('/tasks')` while keeping the return type honest.
 */
export const api = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<TResponse>(url, config).then((res) => res.data),

  post: <TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.post<TResponse>(url, data, config).then((res) => res.data),

  put: <TResponse>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<TResponse>(url, data, config).then((res) => res.data),

  patch: <TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.patch<TResponse>(url, data, config).then((res) => res.data),

  delete: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<TResponse>(url, config).then((res) => res.data),
};
```


## src/lib/react-query.ts

```ts
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
```


## .eslintrc.cjs

```js
/**
 * Architecture rules are enforced here, not just documented.
 *
 * Dependencies point in one direction only:
 *
 *   app  ->  features  ->  shared (components, hooks, lib, utils, types, config)
 *
 * Nothing points back up, and features never reach into each other.
 * Inside a feature use relative imports (`../api/get-tasks`); the `@/features/*`
 * alias is reserved for crossing a feature boundary from `src/app`.
 */
const noDirectAxios = {
  name: 'axios',
  message:
    'Use the shared client from @/lib/api-client so base URL, auth and error handling stay in one place.',
};

const sharedLayerRestrictions = {
  paths: [noDirectAxios],
  patterns: [
    {
      group: ['@/features/*', '@/features/*/**', '@/app/*', '@/app/*/**'],
      message:
        'Shared code must stay feature-agnostic. Move the shared piece down into src/components, src/hooks, src/lib or src/utils instead of importing a feature or the app shell.',
    },
  ],
};

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
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-restricted-imports': ['error', { paths: [noDirectAxios] }],
  },
  overrides: [
    {
      // A feature owns its slice and nothing else.
      files: ['src/features/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/features/*', '@/features/*/**'],
                message:
                  'Features must not import from other features. Use relative paths inside your own feature; if two features need the same thing, lift it into the shared layer or compose them in a route.',
              },
              {
                group: ['@/app/*', '@/app/*/**'],
                message:
                  'Features must not depend on the app shell. Dependencies point downwards: app -> features -> shared.',
              },
            ],
            paths: [noDirectAxios],
          },
        ],
      },
    },
    {
      files: [
        'src/components/**',
        'src/hooks/**',
        'src/lib/**',
        'src/utils/**',
        'src/types/**',
        'src/config/**',
      ],
      rules: {
        'no-restricted-imports': ['error', sharedLayerRestrictions],
      },
    },
    {
      // The one place allowed to talk to axios directly.
      files: ['src/lib/api-client.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          { patterns: sharedLayerRestrictions.patterns },
        ],
      },
    },
    {
      // Route modules intentionally export loaders/actions next to the
      // component, which fast refresh cannot verify.
      files: ['src/app/routes/**'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
    {
      files: ['*.cjs', 'vite.config.ts'],
      env: { node: true },
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
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Absolute imports (`@/features/tasks/...`) instead of `../../../`.
      // Mirrors the `paths` entry in tsconfig.json - keep them in sync.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
```
