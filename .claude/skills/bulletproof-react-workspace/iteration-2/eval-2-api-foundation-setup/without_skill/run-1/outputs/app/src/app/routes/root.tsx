import { Outlet, isRouteErrorResponse, useRouteError } from 'react-router';

import { env } from '@/config/env';

export const RootLayout = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{env.VITE_APP_NAME}</h1>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
);

/**
 * Catches anything thrown while rendering a route - including render-time
 * errors from a query with `throwOnError` turned on - so a single broken screen
 * never leaves the user staring at a blank page.
 */
export const RootErrorBoundary = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <div role="alert" style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.25rem' }}>Something went wrong</h1>
      <p style={{ color: '#4b5563' }}>{message}</p>
      <button type="button" onClick={() => window.location.assign('/')}>
        Go back home
      </button>
    </div>
  );
};
