import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';

export const LoginPage = () => {
  const router = useRouter();
  const { redirectTo } = router.query;

  return (
    <LoginForm
      onSuccess={() =>
        router.replace(
          `${redirectTo ? `${redirectTo}` : paths.app.dashboard.getHref()}`,
        )
      }
    />
  );
};

LoginPage.getLayout = (page: ReactElement) => {
  return <AuthLayout title="Log in to your account">{page}</AuthLayout>;
};
