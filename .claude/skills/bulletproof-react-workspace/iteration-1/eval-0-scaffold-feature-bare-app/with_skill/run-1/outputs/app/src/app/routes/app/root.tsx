import * as React from 'react';
import { Link, Outlet } from 'react-router';

import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';

export const AppRoot = () => {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Link to={paths.home.getHref()} className="app-shell__brand">
          My App
        </Link>
        <nav className="app-shell__nav">
          <Link to={paths.app.tasks.getHref()}>Tasks</Link>
        </nav>
      </header>
      <main className="app-shell__main">
        <React.Suspense
          fallback={
            <div className="flex-center">
              <Spinner />
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </main>
    </div>
  );
};
