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
