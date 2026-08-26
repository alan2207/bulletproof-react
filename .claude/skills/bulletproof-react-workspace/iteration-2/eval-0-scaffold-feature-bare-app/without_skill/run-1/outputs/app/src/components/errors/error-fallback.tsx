import { Button } from '@/components/ui';

import styles from './error-fallback.module.css';

type ErrorFallbackProps = {
  error: Error;
  reset?: () => void;
};

export const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => (
  <div className={styles.fallback} role="alert">
    <h2 className={styles.title}>Something went wrong</h2>
    <p className={styles.message}>{error.message}</p>
    {reset && (
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    )}
  </div>
);
