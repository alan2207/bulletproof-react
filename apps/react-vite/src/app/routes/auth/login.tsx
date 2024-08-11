import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title="Log in to your account">
      <LoginForm
        onSuccess={() =>
          navigate(`${redirectTo ? `${redirectTo}` : '/app'}`, {
            replace: true,
          })
        }
      />
    </AuthLayout>
  );
};
