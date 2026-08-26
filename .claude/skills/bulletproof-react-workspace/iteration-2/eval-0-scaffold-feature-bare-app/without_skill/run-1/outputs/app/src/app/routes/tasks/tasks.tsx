import { CreateTaskForm, TaskList } from '@/features/tasks';

import styles from './tasks.module.css';

/**
 * Route components stay thin: they compose a feature's public API and own
 * nothing but page-level layout.
 */
export const TasksRoute = () => (
  <section className={styles.page}>
    <header>
      <h1 className={styles.title}>Tasks</h1>
      <p className={styles.subtitle}>Everything on your plate, in one place.</p>
    </header>
    <CreateTaskForm />
    <TaskList />
  </section>
);
