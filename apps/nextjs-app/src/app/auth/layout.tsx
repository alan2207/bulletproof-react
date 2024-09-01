import { ReactNode } from 'react';

import { AuthLayout as AuthLayoutComponent } from '@/components/layouts/auth-layout';

export const generateMetadata = (...args: any[]) => {
  console.log(args);
  return {
    title: 'Bulletproof React',
    description: 'Welcome to Bulletproof React',
  };
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <AuthLayoutComponent>{children}</AuthLayoutComponent>;
};

export default AuthLayout;
