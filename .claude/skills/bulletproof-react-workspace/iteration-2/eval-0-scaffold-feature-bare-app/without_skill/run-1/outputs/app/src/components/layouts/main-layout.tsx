import { NavLink, Outlet } from 'react-router';

import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

import styles from './main-layout.module.css';

const navigation = [{ label: 'Tasks', to: paths.tasks.getHref() }];

/**
 * Chrome shared by every authenticated page. Routes render into <Outlet />.
 */
export const MainLayout = () => (
  <div className={styles.shell}>
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <span className={styles.brand}>My App</span>
        <nav className={styles.nav} aria-label="Main">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(styles.navLink, isActive && styles.navLinkActive)
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);
