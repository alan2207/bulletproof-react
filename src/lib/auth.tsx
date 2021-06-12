import { initReactQueryAuth } from 'react-query-auth';

import { Spinner } from '@/components/Elements';
import {
  loginWithEmailAndPassword,
  getUserProfile,
  registerWithEmailAndPassword,
  UserResponse,
} from '@/features/auth';
import storage from '@/utils/storage';

async function handleUserResponse(data: UserResponse) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser() {
  if (storage.getToken()) {
    const data = await getUserProfile();
    return data;
  }
  return null;
}

async function loginFn(data: any) {
  const response = await loginWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data: any) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function logoutFn() {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  // eslint-disable-next-line react/display-name
  renderLoader: () => (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner size="xl" />
    </div>
  ),
};

export const { AuthProvider, useAuth } = initReactQueryAuth(authConfig);
