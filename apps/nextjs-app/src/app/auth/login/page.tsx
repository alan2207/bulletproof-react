'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

  return (
    <LoginForm
      onSuccess={() =>
        router.replace(
          `${redirectTo ? `${decodeURIComponent(redirectTo)}` : paths.app.dashboard.getHref()}`,
        )
      }
    />
  );
};

export default LoginPage;
