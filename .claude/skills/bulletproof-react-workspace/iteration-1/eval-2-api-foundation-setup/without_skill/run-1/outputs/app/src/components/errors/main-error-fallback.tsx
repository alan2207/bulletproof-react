import { type CSSProperties } from 'react';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  minHeight: '100vh',
  padding: '1.5rem',
  textAlign: 'center',
  fontFamily: 'system-ui, sans-serif',
};

const messageStyle: CSSProperties = {
  margin: 0,
  maxWidth: '40rem',
  opacity: 0.75,
  overflowWrap: 'anywhere',
};

const buttonStyle: CSSProperties = {
  padding: '0.5rem 1rem',
  border: '1px solid currentColor',
  borderRadius: '0.375rem',
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
};

type MainErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

/** Shown by the root `ErrorBoundary` when a render crashes. */
export const MainErrorFallback = ({ error, reset }: MainErrorFallbackProps) => (
  <div style={containerStyle} role="alert">
    <h1 style={{ margin: 0 }}>Something went wrong</h1>
    <p style={messageStyle}>{error.message}</p>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button type="button" style={buttonStyle} onClick={reset}>
        Try again
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => window.location.assign(window.location.origin)}
      >
        Reload the app
      </button>
    </div>
  </div>
);
