import { NavLink, Outlet } from 'react-router';

import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

const navigation = [{ name: 'Tasks', to: paths.tasks.getHref() }];

export const MainLayout = () => {
  return (
    <div className="layout">
      <header className="layout__header">
        <span className="layout__brand">My App</span>
        <nav className="layout__nav" aria-label="Main">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn('layout__nav-link', isActive && 'layout__nav-link--active')
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
