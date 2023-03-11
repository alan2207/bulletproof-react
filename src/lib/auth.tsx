import { initReactQueryAuth } from 'react-query-auth';

import { Spinner } from '@/components/Elements';
import {
  loginWithEmailAndPassword,
  getUser,
  registerWithEmailAndPassword,
  UserResponse,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
  AuthUser,
} from '@/features/auth';
import storage from '@/utils/storage';

const myUser = {
	id: 'ds4ds7f7d5fd5f',
	email: 'diyor@gmail.com',
  firstName: 'Diyor',
  lastName: 'Qarshibayev',
  bio: 'something about me',
  role: 'USER',
}

const myResponse = {
	jwt: 'dsdsd5df8s4f4s87f8gf5gh78gh78g4f55a5s5f4s8dfg4441',
	user: myUser
}

async function handleUserResponse(data: UserResponse) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser() {
  if (storage.getToken()) {
//     const data = await getUser();
		const data = await new Promise((resolve) => setTimeout(() => resolve(myUser), 2000 ))
    return data;
  }
  return null;
}

async function loginFn(data: LoginCredentialsDTO) {
//   const response = await loginWithEmailAndPassword(data);
	const response = await new Promise((resolve) => setTimeout(() => resolve(myResponse), 2000 ))
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data: RegisterCredentialsDTO) {
//   const response = await registerWithEmailAndPassword(data);
	const response = await new Promise((resolve) => setTimeout(() => resolve(myResponse), 2000 ))
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
  LoaderComponent() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
  AuthUser | null,
  unknown,
  LoginCredentialsDTO,
  RegisterCredentialsDTO
>(authConfig);
