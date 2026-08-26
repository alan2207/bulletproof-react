import { ErrorFallbackProps } from './error-boundary';

/**
 * Last-resort fallback for the app root. Kept dependency-free so it still
 * renders when whatever broke sits deep in the app.
 */
export const MainErrorFallback = ({ error }: ErrorFallbackProps) => {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#dc2626' }}>
        Something went wrong
      </h1>
      <p style={{ margin: 0, color: '#4b5563', maxWidth: '32rem' }}>
        {error.message}
      </p>
      <button type="button" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};
