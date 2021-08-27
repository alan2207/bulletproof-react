import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';

import { User } from '../types';

export const getUsers = (): Promise<User[]> => {
  return axios.get(`/users`);
};

type UseUsersOptions = {
  config?: QueryConfig<typeof getUsers>;
};

export const useUsers = ({ config }: UseUsersOptions = {}) => {
  return useQuery({
    ...config,
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
