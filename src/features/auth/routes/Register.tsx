import { useNavigate, useSearchParams } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <Layout title="Register your account">
      <RegisterForm
        onSuccess={() => navigate(`${redirectTo ? `${redirectTo}` : '/app'}`, { replace: true })}
      />
    </Layout>
  );
};
