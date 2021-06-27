import { render as rtlRender, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FunctionComponent } from 'react';

import { AppProvider } from '@/context';
import storage from '@/utils/storage';

import { userGenerator } from './data-generators';
import { db } from './server/db';
import { authenticate, hash } from './server/utils';

export const createUser = async (userProperties?: any) => {
  const user = userGenerator(userProperties);
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const loginAsUser = async (userProperties?: any) => {
  const user = await createUser(userProperties);
  const authUser = await authenticate(user);
  storage.setToken(authUser.jwt);
  return authUser;
};

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [...screen.queryAllByTestId(/loading/i), ...screen.queryAllByText(/loading/i)],
    { timeout: 4000 }
  );

// eslint-disable-next-line import/export
export const render = async (
  ui: any,
  { route = '/', user, ...renderOptions }: Record<string, any> = {}
) => {
  // if you want to render the app unauthenticated then pass "null" as the user
  user = typeof user === 'undefined' ? await loginAsUser() : user;
  window.history.pushState({}, 'Test page', route);

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProvider as FunctionComponent<unknown>,
      ...renderOptions,
    }),
    user,
  };

  await waitForLoadingToFinish();

  return returnValue;
};

// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { userEvent, rtlRender };
