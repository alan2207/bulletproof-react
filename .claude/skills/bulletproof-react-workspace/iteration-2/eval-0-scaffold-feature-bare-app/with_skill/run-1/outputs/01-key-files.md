# Key changed files


## src/app/provider.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, Suspense, useState } from 'react';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // Lazy initializer: the client is created once, not on every render.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
```


## src/app/router.tsx

```tsx
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, Navigate } from 'react-router';

import { paths } from '@/config/paths';

/**
 * Adapts a lazily-imported route module to a react-router route object,
 * handing the shared `queryClient` to its loader/action factories.
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

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      lazy: () => import('./routes/app/root').then(convert(queryClient)),
      children: [
        {
          index: true,
          element: <Navigate to={paths.app.tasks.getHref()} replace />,
        },
        {
          path: paths.app.tasks.path,
          lazy: () =>
            import('./routes/app/tasks/tasks').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);
```


## src/config/env.ts

```ts
import { z } from 'zod';

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
  .join('\n')}`,
    );
  }

  return parsedEnv.data;
};

/**
 * Validated environment. Never read `import.meta.env` outside this file.
 */
export const env = createEnv();
```


## src/config/paths.ts

```ts
/**
 * Single source of truth for every route in the app.
 *
 * `path` is what the router registers, `getHref()` is what links use — so no
 * URL is ever hand-assembled as a string elsewhere in the codebase.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    tasks: {
      path: 'tasks',
      getHref: () => '/app/tasks',
    },
  },
} as const;
```


## src/features/tasks/api/create-task.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Task } from '@/types/api';

import { getTasksQueryOptions } from './get-tasks';

/**
 * Exported so the create form validates with the exact same rules the request
 * is built from.
 */
export const createTaskInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = ({
  data,
}: {
  data: CreateTaskInput;
}): Promise<Task> => {
  return api.post('/tasks', data);
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({
  mutationConfig,
}: UseCreateTaskOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTasksQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTask,
  });
};
```


## src/features/tasks/api/get-tasks.ts

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Task } from '@/types/api';

export const getTasks = (): Promise<Task[]> => {
  return api.get('/tasks');
};

/**
 * Exported separately from the hook so route loaders can prefetch and
 * mutations can invalidate — the query key exists in exactly one place.
 */
export const getTasksQueryOptions = () => {
  return queryOptions({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  });
};

type UseTasksOptions = {
  queryConfig?: QueryConfig<typeof getTasksQueryOptions>;
};

export const useTasks = ({ queryConfig }: UseTasksOptions = {}) => {
  return useQuery({
    ...getTasksQueryOptions(),
    ...queryConfig,
  });
};
```


## src/features/tasks/components/create-task.tsx

```tsx
import { ChangeEvent, FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/form';
import { notificationsStore } from '@/components/ui/notifications';

import {
  CreateTaskInput,
  createTaskInputSchema,
  useCreateTask,
} from '../api/create-task';

import styles from './tasks.module.css';

const emptyValues: CreateTaskInput = { title: '', description: '' };

type FieldErrors = Partial<Record<keyof CreateTaskInput, string>>;

export const CreateTask = () => {
  const [values, setValues] = useState<CreateTaskInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        setValues(emptyValues);
        setErrors({});
        notificationsStore.addNotification({
          type: 'success',
          title: 'Task created',
        });
      },
    },
  });

  const handleChange =
    (field: keyof CreateTaskInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Same schema the request is typed from, so client and server validation
    // can't drift apart.
    const result = createTaskInputSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
      });
      return;
    }

    setErrors({});
    createTaskMutation.mutate({ data: result.data });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Title"
        name="title"
        value={values.title}
        error={errors.title}
        onChange={handleChange('title')}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        error={errors.description}
        onChange={handleChange('description')}
      />
      <div>
        <Button type="submit" isLoading={createTaskMutation.isPending}>
          Create task
        </Button>
      </div>
    </form>
  );
};
```


## src/features/tasks/components/task-item.tsx

```tsx
import { Task } from '@/types/api';
import { formatDate } from '@/utils/format';

import styles from './tasks.module.css';

type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => (
  <li className={styles.item}>
    <h3 className={styles.itemTitle}>{task.title}</h3>
    <p className={styles.itemDescription}>{task.description}</p>
    {task.createdAt ? (
      <p className={styles.itemMeta}>{formatDate(task.createdAt)}</p>
    ) : null}
  </li>
);
```


## src/features/tasks/components/tasks-list.tsx

```tsx
import { Spinner } from '@/components/ui/spinner';

import { useTasks } from '../api/get-tasks';

import { TaskItem } from './task-item';
import styles from './tasks.module.css';

export const TasksList = () => {
  const tasksQuery = useTasks();

  if (tasksQuery.isLoading) {
    return (
      <div className={styles.centered}>
        <Spinner size="xl" />
      </div>
    );
  }

  if (tasksQuery.isError) {
    return <p role="alert">Could not load tasks.</p>;
  }

  const tasks = tasksQuery.data;

  if (!tasks?.length) {
    return <p className={styles.empty}>No tasks yet. Create your first one.</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
```


## src/features/tasks/components/tasks.module.css

```js
.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
}

.itemTitle {
  margin: 0;
  font-size: 1rem;
}

.itemDescription {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
}

.itemMeta {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.empty {
  color: var(--color-text-muted);
}

.centered {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}
```


## src/lib/api-client.ts

```ts
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { notificationsStore } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

/**
 * The one API client instance for the whole app. Endpoint files under
 * `features/<feature>/api/` are the only place it should be imported.
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is what lets fetchers be typed `Promise<Task[]>` instead
  // of `Promise<AxiosResponse<Task[]>>` — components never see transport types.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    notificationsStore.addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      // Point this at `paths.auth.login.getHref(redirectTo)` once auth exists.
      const redirectTo = window.location.pathname;
      if (redirectTo !== paths.home.getHref()) {
        window.location.href = paths.home.getHref();
      }
    }

    return Promise.reject(error);
  },
);
```


## src/lib/react-query.ts

```ts
import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

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
 * Everything a caller may override on a query, except the parts the endpoint
 * owns (`queryKey` / `queryFn`).
 */
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

/**
 * Full mutation options with data/variables inferred from the fetcher, so no
 * endpoint has to hand-write generics.
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
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'check-file'],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    // Module boundaries. Add one zone per feature — a feature that is not
    // listed here is silently unprotected against cross-feature imports.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // disables cross-feature imports:
          // e.g. src/features/tasks must not import from src/features/<other>
          {
            target: './src/features/tasks',
            from: './src/features',
            except: ['./tasks'],
          },

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
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'react/prop-types': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        'check-file/filename-naming-convention': [
          'error',
          { '**/*.{ts,tsx}': 'KEBAB_CASE' },
          { ignoreMiddleExtensions: true },
        ],
      },
    },
    {
      files: ['src/**/!(__tests__)/*'],
      rules: {
        'check-file/folder-naming-convention': [
          'error',
          { '**/*': 'KEBAB_CASE' },
        ],
      },
    },
    {
      // Route modules intentionally export `clientLoader`/`clientAction`
      // alongside their component.
      files: ['src/app/routes/**/*.tsx'],
      rules: {
        'react-refresh/only-export-components': 'off',
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
    "types": ["vite/client"],
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
    // Mirrors the `@/*` -> `./src/*` mapping in tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
