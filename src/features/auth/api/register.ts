import { z } from 'zod';

import { axios } from '@/lib/axios';

import { UserResponse } from '../types';

export const registerInputSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, 'Required'),
        teamName: z.null().default(null),
      })
      .or(z.object({ teamName: z.string().min(1, 'Required'), teamId: z.null().default(null) }))
  );

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerWithEmailAndPassword = (data: RegisterInput): Promise<UserResponse> => {
  return axios.post('/auth/register', data);
};
