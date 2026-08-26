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
  // Initializer form: the client is created once, not on every render.
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="screen-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ErrorBoundary fallback={<MainErrorFallback />}>
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
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { paths } from '@/config/paths';

import { AppRoot } from './routes/app/root';

/**
 * Adapts a lazily-imported route module to react-router's shape: the module
 * exports `clientLoader`/`clientAction` FACTORIES that take the queryClient,
 * so loaders can prefetch through react-query.
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

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
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

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = React.useMemo(
    () => createAppRouter(queryClient),
    [queryClient],
  );

  return <RouterProvider router={router} />;
};
```


## src/config/env.ts

```ts
import { z } from 'zod';

/**
 * Env vars are parsed once, at startup, through a zod schema. The app fails
 * fast with a readable message instead of misbehaving later at runtime.
 *
 * Nothing else in the app reads `import.meta.env` directly — import `env`.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1),
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

export const env = createEnv();
```


## src/config/paths.ts

```ts
/**
 * Single registry of every route in the app.
 *
 * `path` is what the router mounts, `getHref()` is what links call — so URLs
 * are never hand-assembled as strings anywhere else in the codebase.
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

/** Exported so the create-task form validates with the exact same rules. */
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
 * Exported separately from the hook so route loaders can prefetch and mutations
 * can invalidate with `getTasksQueryOptions().queryKey` — the key is defined
 * here and nowhere else.
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
import { Button } from '@/components/ui/button/button';
import { Form } from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/form/textarea';
import { useNotifications } from '@/components/ui/notifications/notifications-store';
import {
  createTaskInputSchema,
  useCreateTask,
} from '@/features/tasks/api/create-task';

export const CreateTask = () => {
  const { addNotification } = useNotifications();

  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({ type: 'success', title: 'Task created' });
      },
    },
  });

  return (
    <Form
      id="create-task"
      className="create-task"
      schema={createTaskInputSchema}
      onSubmit={(values) => createTaskMutation.mutateAsync({ data: values })}
    >
      {({ errors }) => (
        <>
          <Input
            label="Title"
            name="title"
            placeholder="Ship the thing"
            error={errors.title}
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="What needs to happen?"
            error={errors.description}
          />
          <Button type="submit" isLoading={createTaskMutation.isPending}>
            Create task
          </Button>
        </>
      )}
    </Form>
  );
};
```


## src/features/tasks/components/task-list-item.tsx

```tsx
import { Task } from '@/types/api';

type TaskListItemProps = {
  task: Task;
};

export const TaskListItem = ({ task }: TaskListItemProps) => {
  return (
    <li className="task">
      <h3 className="task__title">{task.title}</h3>
      <p className="task__description">{task.description}</p>
    </li>
  );
};
```


## src/features/tasks/components/tasks-list.tsx

```tsx
import { Spinner } from '@/components/ui/spinner/spinner';
import { useTasks } from '@/features/tasks/api/get-tasks';
import { TaskListItem } from '@/features/tasks/components/task-list-item';

export const TasksList = () => {
  const tasksQuery = useTasks();

  if (tasksQuery.isLoading) {
    return (
      <div className="flex-center">
        <Spinner label="Loading tasks" />
      </div>
    );
  }

  const tasks = tasksQuery.data;

  if (!tasks?.length) {
    return <p className="muted">No tasks yet. Create one above.</p>;
  }

  return (
    <ul className="tasks-list">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};
```


## src/lib/api-client.ts

```ts
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

/**
 * The single pre-configured API client for the whole app. Everything requests
 * share — auth headers, response unwrapping, error surfacing — lives here, so
 * endpoint files stay three lines long and components never see transport.
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is why fetchers are typed `Promise<Task>` rather than
  // `Promise<AxiosResponse<Task>>`.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    // When an auth feature is added, redirect 401s to the login route here
    // via paths.auth.login.getHref(redirectTo).

    return Promise.reject(error);
  },
);
```


## src/lib/react-query.ts

```ts
/* eslint-disable @typescript-eslint/no-explicit-any -- these helpers are
   deliberately generic over any fetcher signature. */
import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

/**
 * These helpers are what let every API hook accept caller overrides without
 * hand-written generics per endpoint — everything is inferred from the fetcher.
 */
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
    'plugin:import/errors',
    'plugin:import/warnings',
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
    'import/internal-regex': '^@/',
  },
  rules: {
    // --- Module boundaries -------------------------------------------------
    // This is what turns the architecture from convention into enforcement.
    // EVERY new feature needs its own cross-feature zone entry below.
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
          // src/app can import from src/features, but not the other way around
          {
            target: './src/features',
            from: './src/app',
          },

          // shared modules must not import from features or app
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

    // --- Import hygiene ----------------------------------------------------
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
    'import/no-unresolved': 'off',

    // --- Naming: kebab-case files and folders ------------------------------
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': [
      'error',
      { 'src/**/!(__tests__)': 'KEBAB_CASE' },
    ],

    // --- General -----------------------------------------------------------
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // Route modules intentionally export `clientLoader`/`clientAction`
      // alongside their default component — that is the router contract.
      files: ['src/app/routes/**/*.tsx'],
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
      // mirrors the `@/*` -> `./src/*` mapping in tsconfig.json
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
