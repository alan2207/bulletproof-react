import { useSearchParams } from 'react-router';

/**
 * Placeholder for the auth feature.
 *
 * It exists because the API client sends users here on a 401 - without a route
 * registered, an expired session would dead-end on the not-found page. The real
 * screen belongs in `src/features/auth/`; it should read `redirectTo` and send
 * the user back where they were once the session cookie is re-established.
 */
export const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div>
      <h2>Sign in</h2>
      <p>Your session has expired or you are not signed in.</p>
      {redirectTo ? (
        <p style={{ color: '#4b5563' }}>
          You will be returned to <code>{redirectTo}</code> after signing in.
        </p>
      ) : null}
    </div>
  );
};
