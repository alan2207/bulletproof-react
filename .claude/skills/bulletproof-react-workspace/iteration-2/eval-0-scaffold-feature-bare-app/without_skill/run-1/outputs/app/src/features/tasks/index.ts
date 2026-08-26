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
