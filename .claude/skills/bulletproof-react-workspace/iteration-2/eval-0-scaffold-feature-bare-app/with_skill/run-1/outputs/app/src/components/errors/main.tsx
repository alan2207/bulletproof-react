import { Button } from '@/components/ui/button';

import { ErrorFallbackProps } from './error-boundary';

export const MainErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => (
  <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Something went wrong</h2>
    <p style={{ color: 'var(--color-text-muted)' }}>{error.message}</p>
    <Button variant="secondary" onClick={resetErrorBoundary}>
      Try again
    </Button>
  </div>
);
