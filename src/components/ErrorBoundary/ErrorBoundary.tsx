import * as React from 'react';
import { ErrorBoundary as BasicErrorBoundary, FallbackProps } from 'react-error-boundary';

import { Button } from '@/components/Elements';

import { errorHandler } from './errorHandler';

const ErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Ooops, something went wrong :( </h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>Refresh</Button>
    </div>
  );
};

interface ErrorBoundaryProps {
  FallbackComponent?: React.ComponentType<FallbackProps>;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  FallbackComponent = ErrorFallback,
}) => {
  return (
    <BasicErrorBoundary FallbackComponent={FallbackComponent} onError={errorHandler}>
      {children}
    </BasicErrorBoundary>
  );
};
