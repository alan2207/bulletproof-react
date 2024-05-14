import { api } from '@/lib/api-client';

export const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};
