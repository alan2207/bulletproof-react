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
