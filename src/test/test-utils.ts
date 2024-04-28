import { render as rtlRender, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppProvider } from '@/providers/app';
import storage from '@/utils/storage';

import { discussionGenerator, userGenerator } from './data-generators';
import { db } from './server/db';
import { authenticate, hash } from './server/utils';

export const createUser = async (userProperties?: any) => {
  const user = userGenerator(userProperties) as any;
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const createDiscussion = async (discussionProperties?: any) => {
  const discussion = discussionGenerator(discussionProperties);
  const res = await db.discussion.create(discussion);
  return res;
};

export const loginAsUser = async (user: any) => {
  const authUser = await authenticate(user);
  storage.setToken(authUser.jwt);
  return authUser;
};

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [...screen.queryAllByTestId(/loading/i), ...screen.queryAllByText(/loading/i)],
    { timeout: 4000 }
  );

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

// eslint-disable-next-line import/export
export const renderApp = async (
  ui: any,
  { route = '/', user, ...renderOptions }: Record<string, any> = {}
) => {
  // if you want to render the app unauthenticated then pass "null" as the user
  const initializedUser = await initializeUser(user);

  window.history.pushState({}, 'Test page', route);

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProvider,
      ...renderOptions,
    }),
    user: initializedUser,
  };

  await waitForLoadingToFinish();

  return returnValue;
};

// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { userEvent, rtlRender };
