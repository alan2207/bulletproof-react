# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { ErrorFallback } from '@/components/errors/error-fallback';
import { createQueryClient } from '@/lib/react-query';

type AppProviderProps = {
  children: ReactNode;
};

/**
 * Every app-wide provider lives here, in one place. Tests can render a subtree
 * with the same wrapper instead of duplicating setup.
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  // Created once per app instance (never at module scope, so tests get a
  // fresh cache).
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <ErrorFallback error={error} reset={reset} />
      )}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  );
};
```


## src/app/router.tsx

```tsx
import { createBrowserRouter, Navigate } from 'react-router';

import { MainLayout } from '@/components/layouts/main-layout';
import { paths } from '@/config/paths';

import { NotFoundRoute } from './routes/not-found';
import { RouteErrorBoundary } from './routes/route-error';

/**
 * One route entry per page. Page modules are loaded with `lazy` so each
 * feature ships in its own chunk — adding features doesn't grow the initial
 * bundle.
 */
export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <MainLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          index: true,
          element: <Navigate to={paths.tasks.getHref()} replace />,
        },
        {
          path: paths.tasks.path,
          lazy: async () => {
            const { TasksRoute } = await import('./routes/tasks/tasks');
            return { Component: TasksRoute };
          },
        },
        {
          path: '*',
          element: <NotFoundRoute />,
        },
      ],
    },
  ]);
```


## src/config/env.ts

```ts
import { z } from 'zod';

/**
 * Environment variables are validated once, at startup, so a misconfigured
 * deploy fails loudly here instead of as a confusing runtime error later.
 * Nothing else in the app should read `import.meta.env` directly.
 */
const envSchema = z.object({
  API_URL: z.string().default(''),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse({
    API_URL: import.meta.env.VITE_API_URL,
    APP_ENV: import.meta.env.VITE_APP_ENV,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - VITE_${String(issue.path[0])}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return result.data;
};

export const env = parseEnv();
```


## src/config/paths.ts

```ts
/**
 * Single source of truth for URLs.
 *
 * `path` is what the router registers, `getHref` is what links call. Keeping
 * both here means a route can be renamed without grepping for string literals.
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
} as const;
```


## src/features/tasks/api/create-task.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import {
  createTaskInputSchema,
  taskSchema,
  type CreateTaskInput,
  type Task,
} from '../types';
import { taskKeys } from './query-keys';

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const payload = createTaskInputSchema.parse(data);
  const response = await apiClient.post('/tasks', payload);
  return taskSchema.parse(response.data);
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
    mutationFn: createTask,
    onSuccess: (...args) => {
      // Cache invalidation is the hook's job, not the caller's.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
```


## src/features/tasks/api/get-tasks.ts

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';

import { tasksSchema, type Task } from '../types';
import { taskKeys } from './query-keys';

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks');
  // Validate at the boundary: nothing downstream has to defend against a
  // payload that doesn't match the contract.
  return tasksSchema.parse(response.data);
};

export const getTasksQueryOptions = () =>
  queryOptions({
    queryKey: taskKeys.lists(),
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


## src/features/tasks/api/query-keys.ts

```ts
/**
 * All cache keys for this feature in one place, so invalidation stays
 * predictable as more task endpoints are added.
 */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
};
```


## src/features/tasks/components/create-task-form.module.css

```js
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.formError {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--color-danger-surface);
  color: var(--color-danger);
  font-size: 0.875rem;
}
```


## src/features/tasks/components/create-task-form.tsx

```tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ZodIssue } from 'zod';

import { Button, Input, Textarea } from '@/components/ui';

import { useCreateTask } from '../api/create-task';
import { createTaskInputSchema, type CreateTaskInput } from '../types';
import styles from './create-task-form.module.css';

type FieldErrors = Partial<Record<keyof CreateTaskInput, string>>;

const EMPTY_FORM: CreateTaskInput = { title: '', description: '' };

const toFieldErrors = (issues: ZodIssue[]) =>
  issues.reduce<FieldErrors>((acc, issue) => {
    const field = issue.path[0] as keyof CreateTaskInput | undefined;
    if (field && !acc[field]) {
      acc[field] = issue.message;
    }
    return acc;
  }, {});

export const CreateTaskForm = () => {
  const [values, setValues] = useState<CreateTaskInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  const createTask = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        setValues(EMPTY_FORM);
        setErrors({});
      },
    },
  });

  const handleChange =
    (field: keyof CreateTaskInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Same schema the API layer uses, so client and server agree on "valid".
    const result = createTaskInputSchema.safeParse(values);

    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    createTask.mutate(result.data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        name="title"
        placeholder="Write the release notes"
        value={values.title}
        onChange={handleChange('title')}
        error={errors.title}
        disabled={createTask.isPending}
      />
      <Textarea
        label="Description"
        name="description"
        rows={3}
        placeholder="What needs to happen?"
        value={values.description}
        onChange={handleChange('description')}
        error={errors.description}
        disabled={createTask.isPending}
      />
      {createTask.isError && (
        <p className={styles.formError} role="alert">
          {createTask.error.message}
        </p>
      )}
      <div className={styles.actions}>
        <Button type="submit" isLoading={createTask.isPending}>
          Add task
        </Button>
      </div>
    </form>
  );
};
```


## src/features/tasks/components/task-list-item.tsx

```tsx
import { formatDateTime } from '@/utils/format';

import type { Task } from '../types';
import styles from './task-list.module.css';

type TaskListItemProps = {
  task: Task;
};

export const TaskListItem = ({ task }: TaskListItemProps) => (
  <li className={styles.item}>
    <h3 className={styles.itemTitle}>{task.title}</h3>
    <p className={styles.itemDescription}>{task.description}</p>
    {task.createdAt && (
      <time className={styles.itemMeta} dateTime={task.createdAt}>
        {formatDateTime(task.createdAt)}
      </time>
    )}
  </li>
);
```


## src/features/tasks/components/task-list.module.css

```js
.list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.itemTitle {
  font-size: 1rem;
  font-weight: 600;
}

.itemDescription {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  overflow-wrap: anywhere;
}

.itemMeta {
  display: block;
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}

.stateRow {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```


## src/features/tasks/components/task-list.tsx

```tsx
import { Button, Spinner } from '@/components/ui';

import { useTasks } from '../api/get-tasks';
import styles from './task-list.module.css';
import { TaskListItem } from './task-list-item';

export const TaskList = () => {
  // Destructuring keeps react-query's discriminated union intact, so `tasks`
  // is non-nullable below without a `!` or an optional chain.
  const {
    data: tasks,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useTasks();

  if (isPending) {
    return (
      <div className={styles.state}>
        <span className={styles.stateRow}>
          <Spinner size="sm" />
          Loading tasks…
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state} role="alert">
        <p>We couldn&rsquo;t load your tasks: {error.message}</p>
        <Button variant="secondary" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={styles.state}>
        <p>No tasks yet. Add your first one above.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list} aria-busy={isFetching}>
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
```


## src/features/tasks/index.ts

```ts
/**
 * Public API of the `tasks` feature.
 *
 * Anything not exported here is private to the feature — ESLint blocks deep
 * imports like `@/features/tasks/api/get-tasks` from outside.
 */
export { CreateTaskForm } from './components/create-task-form';
export { TaskList } from './components/task-list';

export { useTasks, getTasksQueryOptions } from './api/get-tasks';
export { useCreateTask } from './api/create-task';
export { taskKeys } from './api/query-keys';

export type { Task, CreateTaskInput } from './types';
```


## src/features/tasks/types.ts

```ts
import { z } from 'zod';

import { baseEntitySchema } from '@/types/api';

/**
 * The feature's contract with the outside world.
 *
 * Schemas are the source of truth and the types are inferred from them, so the
 * runtime check at the API boundary and the compile-time type can never drift.
 */
export const taskSchema = baseEntitySchema.extend({
  title: z.string(),
  description: z.string(),
});

export const tasksSchema = z.array(taskSchema);

export type Task = z.infer<typeof taskSchema>;

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or fewer'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
```


## src/lib/api-client.ts

```ts
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import type { ApiErrorResponse } from '@/types/api';

/**
 * Every failed request surfaces as an `ApiError`, so UI code can rely on
 * `error.message` / `error.status` without knowing that axios exists.
 */
export class ApiError extends Error {
  readonly status?: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const withDefaultHeaders = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
};

/**
 * The single axios instance for the whole app. Features never create their own
 * client — auth headers, base URL and error normalisation are configured once,
 * here.
 */
export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(withDefaultHeaders);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';

    return Promise.reject(
      new ApiError(
        message,
        error.response?.status,
        error.response?.data?.errors,
      ),
    );
  },
);
```


## src/lib/react-query.ts

```ts
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
```


## .eslintrc.cjs

```js
/**
 * Architecture is enforced here, not just documented.
 *
 * Dependencies may only point in one direction:
 *
 *   shared (components, hooks, lib, utils, types, config)
 *        -> features/*
 *              -> app (routing + providers)
 *
 * - Shared code never imports a feature.
 * - Features never import from `app`.
 * - A feature is only reachable through its public API (`@/features/<name>`),
 *   never through its internals. Inside a feature, use relative imports.
 */

const featurePublicApiOnly = {
  group: ['@/features/*/*', '@/features/*/**'],
  message:
    'Import a feature through its public API ("@/features/tasks"), not its internals. Inside a feature, use relative imports.',
};

const noAppImports = {
  group: ['@/app', '@/app/*', '@/app/**'],
  message:
    'Only the app layer may import from "@/app". Dependencies point shared -> features -> app.',
};

const noFeatureImports = {
  group: ['@/features', '@/features/*', '@/features/**'],
  message:
    'Shared code must not depend on a feature. Move the reusable part into components/hooks/lib/utils instead.',
};

const restrict = (...patterns) => ['error', { patterns }];

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
    'no-restricted-imports': restrict(featurePublicApiOnly),
  },
  overrides: [
    {
      // Features may use shared code, but not each other's internals and not the app layer.
      files: ['src/features/**'],
      rules: {
        'no-restricted-imports': restrict(featurePublicApiOnly, noAppImports),
      },
    },
    {
      // Shared code sits at the bottom of the graph: it knows about nothing above it.
      files: [
        'src/components/**',
        'src/hooks/**',
        'src/lib/**',
        'src/utils/**',
        'src/types/**',
        'src/config/**',
      ],
      rules: {
        'no-restricted-imports': restrict(noAppImports, noFeatureImports),
      },
    },
    {
      // Barrel files re-export only; fast-refresh heuristics don't apply.
      files: ['src/**/index.ts'],
      rules: { 'react-refresh/only-export-components': 'off' },
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
