import { Button } from '@/components/ui/button/button';
import type { FallbackProps } from '@/components/errors/error-boundary';

export const MainErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div className="error-fallback" role="alert">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <Button variant="secondary" onClick={() => window.location.assign('/')}>
        Refresh
      </Button>
    </div>
  );
};
