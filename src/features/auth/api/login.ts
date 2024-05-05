import { z } from 'zod';

import { axios } from '@/lib/axios';

import { UserResponse } from '../types';

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginWithEmailAndPassword = (data: LoginInput): Promise<UserResponse> => {
  return axios.post('/auth/login', data);
};
