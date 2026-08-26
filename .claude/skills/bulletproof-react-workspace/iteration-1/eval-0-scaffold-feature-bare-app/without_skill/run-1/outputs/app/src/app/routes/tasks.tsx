import type { QueryClient } from '@tanstack/react-query';

import { getTasksQueryOptions } from '@/features/tasks/api/get-tasks';
import { CreateTaskForm } from '@/features/tasks/components/create-task-form';
import { TasksList } from '@/features/tasks/components/tasks-list';

/**
 * Warms the react-query cache before the route renders, so the list is
 * already there on first paint. The route and the `useTasks` hook share one
 * query key, so there is no second request.
 */
export const tasksLoader = (queryClient: QueryClient) => async () => {
  const query = getTasksQueryOptions();
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.ensureQueryData(query))
  );
};

/**
 * Routes stay thin: they compose feature components and own nothing else.
 * All task logic lives in `src/features/tasks`.
 */
export const TasksRoute = () => {
  return (
    <div className="stack">
      <div>
        <h1>Tasks</h1>
        <p className="muted">Everything on the list, and what to add next.</p>
      </div>

      <section className="panel" aria-labelledby="create-task-heading">
        <h2 id="create-task-heading">New task</h2>
        <CreateTaskForm />
      </section>

      <section aria-labelledby="task-list-heading">
        <h2 id="task-list-heading">All tasks</h2>
        <TasksList />
      </section>
    </div>
  );
};
