import { axios } from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  role: 'ADMIN' | 'USER';
}

export interface UserResponse {
  jwt: string;
  user: AuthUser;
}

export const loginWithEmailAndPassword = (data: LoginCredentials): Promise<UserResponse> => {
  return axios.post('/auth/login', data);
};

export const registerWithEmailAndPassword = (data: RegisterCredentials): Promise<UserResponse> => {
  return axios.post('/auth/register', data);
};

export const getUserProfile = (): Promise<AuthUser> => {
  return axios.get('/auth/me');
};
