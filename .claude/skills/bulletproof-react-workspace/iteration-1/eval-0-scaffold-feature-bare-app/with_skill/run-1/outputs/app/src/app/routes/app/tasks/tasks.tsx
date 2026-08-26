import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts/content-layout';
import { getTasksQueryOptions } from '@/features/tasks/api/get-tasks';
import { CreateTask } from '@/features/tasks/components/create-task';
import { TasksList } from '@/features/tasks/components/tasks-list';

/**
 * Warms the react-query cache before the route renders, so the list does not
 * flash a spinner on navigation. The key comes from the query options factory,
 * never from a hand-typed literal.
 */
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getTasksQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

const TasksRoute = () => {
  return (
    <ContentLayout title="Tasks">
      <CreateTask />
      <TasksList />
    </ContentLayout>
  );
};

export default TasksRoute;
