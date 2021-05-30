import { axios } from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
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

export const getUserProfile = (): Promise<{ data: AuthUser }> => {
  return axios.get('/auth/me');
};
