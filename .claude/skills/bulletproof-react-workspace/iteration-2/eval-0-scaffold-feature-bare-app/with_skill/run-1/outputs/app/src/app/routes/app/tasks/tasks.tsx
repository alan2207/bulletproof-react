import { QueryClient } from '@tanstack/react-query';

import { getTasksQueryOptions } from '@/features/tasks/api/get-tasks';
import { CreateTask } from '@/features/tasks/components/create-task';
import { TasksList } from '@/features/tasks/components/tasks-list';

/**
 * Prefetch on navigation: read the cache first, only fetch on a miss.
 */
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getTasksQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

const TasksRoute = () => (
  <div style={{ display: 'grid', gap: '1.5rem' }}>
    <h1>Tasks</h1>
    <CreateTask />
    <TasksList />
  </div>
);

export default TasksRoute;
