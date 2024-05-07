import { api } from '@/lib/api-client';

import { AuthUser } from '../types';

export const getUser = (): Promise<AuthUser> => {
  return api.get('/auth/me');
};
