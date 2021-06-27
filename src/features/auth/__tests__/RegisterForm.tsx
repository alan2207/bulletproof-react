import { userGenerator } from '@/test/data-generators';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

import { RegisterForm } from '../components/RegisterForm';

test('should register new user and call onRegister cb which should navigate the user to the app', async () => {
  const newUser = userGenerator({});

  const onRegister = jest.fn();

  await render(<RegisterForm onRegister={onRegister} />, { user: null });

  userEvent.type(screen.getByLabelText(/first name/i), newUser.firstName);
  userEvent.type(screen.getByLabelText(/last name/i), newUser.lastName);
  userEvent.type(screen.getByLabelText(/email address/i), newUser.email);
  userEvent.type(screen.getByLabelText(/password/i), newUser.password);
  userEvent.type(screen.getByLabelText(/team name/i), newUser.teamName);

  userEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => expect(onRegister).toHaveBeenCalledTimes(1));
});
