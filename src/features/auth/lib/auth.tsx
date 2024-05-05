import { configureAuth } from 'react-query-auth';

import { getUser } from '../api/get-user';
import { LoginInput, loginWithEmailAndPassword } from '../api/login';
import { logout } from '../api/logout';
import { RegisterInput, registerWithEmailAndPassword } from '../api/register';
import { UserResponse } from '../types';

async function handleUserResponse(data: UserResponse) {
  const { user } = data;
  return user;
}

async function userFn() {
  return getUser();
}

async function loginFn(data: LoginInput) {
  const response = await loginWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data: RegisterInput) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function logoutFn() {
  await logout();
  // window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  userFn,
  loginFn,
  registerFn,
  logoutFn,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } = configureAuth(authConfig);
