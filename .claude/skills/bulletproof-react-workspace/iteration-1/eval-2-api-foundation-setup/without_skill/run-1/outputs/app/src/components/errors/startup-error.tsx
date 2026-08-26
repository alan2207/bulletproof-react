import { type CSSProperties } from 'react';

/**
 * The screen shown when the app fails before React can mount — in practice,
 * when `src/config/env.ts` rejects the environment.
 *
 * This component must not import anything beyond React. Whatever it depends on
 * is a module that could itself be the thing that failed.
 */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  minHeight: '100vh',
  padding: '2rem',
  fontFamily: 'system-ui, sans-serif',
};

const detailStyle: CSSProperties = {
  margin: 0,
  padding: '1rem',
  border: '1px solid rgb(127 127 127 / 40%)',
  borderLeft: '4px solid #dc2626',
  borderRadius: '0.5rem',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '0.8125rem',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
};

const toMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return 'An unknown error occurred while starting the app.';
};

export const StartupError = ({ error }: { error: unknown }) => (
  <div style={containerStyle} role="alert">
    <h1 style={{ margin: 0, fontSize: '1.25rem' }}>The app could not start</h1>
    <p style={detailStyle}>{toMessage(error)}</p>
  </div>
);
