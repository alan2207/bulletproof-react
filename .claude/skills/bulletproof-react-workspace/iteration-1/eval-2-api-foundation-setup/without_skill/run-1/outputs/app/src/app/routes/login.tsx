import { useSearchParams } from 'react-router';

/**
 * Placeholder for the real login screen.
 *
 * It exists now because the API client redirects here whenever the backend
 * answers 401, and a redirect to a route that does not exist is a confusing way
 * to discover that your session expired. `redirectTo` carries the page the user
 * was on, so the real form can send them back after signing in.
 */
export const LoginRoute = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Sign in</h1>
      <p>Your session has expired or you are not signed in yet.</p>
      {redirectTo ? (
        <p>
          After signing in you will be returned to <code>{redirectTo}</code>.
        </p>
      ) : null}
    </main>
  );
};
