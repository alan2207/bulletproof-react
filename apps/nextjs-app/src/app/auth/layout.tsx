import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Spinner } from '@/components/ui/spinner';

import { AuthLayout as AuthLayoutComponent } from './_components/auth-layout';

export const metadata = {
  title: 'Bulletproof React',
  description: 'Welcome to Bulletproof React',
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <AuthLayoutComponent>{children}</AuthLayoutComponent>
      </ErrorBoundary>
    </Suspense>
  );
};

export default AuthLayout;
