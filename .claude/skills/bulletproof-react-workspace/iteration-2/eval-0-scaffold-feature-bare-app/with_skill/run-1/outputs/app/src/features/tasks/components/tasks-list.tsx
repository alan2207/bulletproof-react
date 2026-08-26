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
