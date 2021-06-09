import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/Elements';
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
        {({ register, formState }) => (
          <>
            <InputField
              type="email"
              label="Email Address"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <InputField
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
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
