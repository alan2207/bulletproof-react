import { Link, useNavigate } from 'react-router-dom';

import { Form, InputField } from '@/components/Form';
import { useAuth } from '@/lib/auth';

type LoginValues = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Form<LoginValues>
        onSubmit={async (values) => {
          await login(values);
          navigate('/app');
        }}
      >
        {({ register }) => (
          <>
            <InputField
              name="email"
              type="email"
              label="Email Address"
              registration={register('email')}
            />
            <InputField
              name="password"
              type="password"
              label="Password"
              registration={register('password')}
            />
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log in
              </button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link to="../register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
