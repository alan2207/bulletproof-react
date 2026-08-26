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
