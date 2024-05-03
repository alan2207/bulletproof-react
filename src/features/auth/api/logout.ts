import { axios } from '@/lib/axios';

export const logout = (): Promise<void> => {
  return axios.post('/auth/logout');
};
