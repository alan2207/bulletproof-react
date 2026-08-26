import { Button } from '@/components/ui/button/button';

export const MainErrorFallback = () => {
  return (
    <div className="screen-center" role="alert">
      <h2>Something went wrong</h2>
      <p className="muted">
        The app hit an unexpected error. Refreshing usually fixes it.
      </p>
      <Button type="button" onClick={() => window.location.assign('/')}>
        Refresh
      </Button>
    </div>
  );
};
