import { useNavigate, useSearchParams } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { LoginForm } from '../components/LoginForm';

export const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <Layout title="Log in to your account">
      <LoginForm
        onSuccess={() => navigate(`${redirectTo ? `${redirectTo}` : '/app'}`, { replace: true })}
      />
    </Layout>
  );
};
