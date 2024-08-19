import {
  render as rtlRender,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';

import { AppProvider } from '@/app/provider';

import {
  createDiscussion as generateDiscussion,
  createUser as generateUser,
} from './data-generators';
import { db } from './mocks/db';
import { AUTH_COOKIE, authenticate, hash } from './mocks/utils';

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByTestId(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 4000 },
  );

export const createUser = async (userProperties?: any) => {
  const user = generateUser(userProperties) as any;
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const createDiscussion = async (discussionProperties?: any) => {
  const discussion = generateDiscussion(discussionProperties);
  const res = await db.discussion.create(discussion);
  return res;
};

export const loginAsUser = async (user: any) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};

const initializeUser = async (user: any) => {
  if (typeof user === 'undefined') {
    const newUser = await createUser();
    return loginAsUser(newUser);
  } else if (user) {
    return loginAsUser(user);
  } else {
    return null;
  }
};

export const renderApp = async (
  ui: any,
  { user, ...renderOptions }: Record<string, any> = {},
) => {
  // if you want to render the app unauthenticated then pass "null" as the user
  const initializedUser = await initializeUser(user);

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProvider,
      ...renderOptions,
    }),
    user: initializedUser,
  };

  return returnValue;
};

export * from '@testing-library/react';
export { userEvent, rtlRender };
