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
