import { ReactNode } from 'react';

import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

import styles from './dashboard-layout.module.css';

const navigation = [{ name: 'Tasks', to: paths.app.tasks.getHref() }] as const;

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className={styles.layout}>
    <header className={styles.header}>
      <Link className={styles.brand} to={paths.home.getHref()}>
        My App
      </Link>
      <nav className={styles.nav}>
        {navigation.map((item) => (
          <Link key={item.name} to={item.to}>
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
    <main className={styles.main}>{children}</main>
  </div>
);
