import { formatDateTime } from '@/utils/format';

import type { Task } from '../types';
import styles from './task-list.module.css';

type TaskListItemProps = {
  task: Task;
};

export const TaskListItem = ({ task }: TaskListItemProps) => (
  <li className={styles.item}>
    <h3 className={styles.itemTitle}>{task.title}</h3>
    <p className={styles.itemDescription}>{task.description}</p>
    {task.createdAt && (
      <time className={styles.itemMeta} dateTime={task.createdAt}>
        {formatDateTime(task.createdAt)}
      </time>
    )}
  </li>
);
