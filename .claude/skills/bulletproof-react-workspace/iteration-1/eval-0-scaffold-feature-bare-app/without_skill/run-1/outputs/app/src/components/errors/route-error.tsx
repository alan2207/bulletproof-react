import { isRouteErrorResponse, useRouteError } from 'react-router';

/**
 * Rendered by react-router when a loader/action throws or a route component
 * fails. Keeps the layout and navigation intact.
 */
export const RouteError = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unexpected error';

  return (
    <div className="callout callout--error" role="alert">
      <h2>This page could not be loaded</h2>
      <p>{message}</p>
    </div>
  );
};
