import { createUser, render, screen, userEvent, waitFor } from '@/test/test-utils';

import { LoginForm } from '../components/LoginForm';

test('should login new user and call onLogin cb which should navigate the user to the app', async () => {
  const newUser = await await createUser({ teamId: undefined });

  const onLogin = jest.fn();

  await render(<LoginForm onLogin={onLogin} />, { user: null });

  userEvent.type(screen.getByLabelText(/email address/i), newUser.email);
  userEvent.type(screen.getByLabelText(/password/i), newUser.password);

  userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1));
});
