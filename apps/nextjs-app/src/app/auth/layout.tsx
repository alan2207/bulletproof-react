'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { AuthLayout as AuthLayoutComponent } from '@/components/layouts/auth-layout';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';
  const title = isLoginPage
    ? 'Log in to your account'
    : 'Register your account';

  return <AuthLayoutComponent title={title}>{children}</AuthLayoutComponent>;
};

export default AuthLayout;
