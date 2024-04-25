import { userGenerator } from '@/test/data-generators';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

import { RegisterForm } from '../RegisterForm';

test('should register new user and call onSuccess cb which should navigate the user to the app', async () => {
  const newUser = userGenerator({});

  const onSuccess = jest.fn();

  await render(<RegisterForm onSuccess={onSuccess} />, { user: null });

  await userEvent.type(screen.getByLabelText(/first name/i), newUser.firstName);
  await userEvent.type(screen.getByLabelText(/last name/i), newUser.lastName);
  await userEvent.type(screen.getByLabelText(/email address/i), newUser.email);
  await userEvent.type(screen.getByLabelText(/password/i), newUser.password);
  await userEvent.type(screen.getByLabelText(/team name/i), newUser.teamName);

  await userEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
});
