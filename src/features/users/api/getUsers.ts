import { useQuery } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { ApiFnReturnType, QueryConfig } from '@/lib/react-query';

import { User } from '../types';

export const getUsers = (): Promise<User[]> => {
  return axios.get(`/users`);
};

type QueryFnType = typeof getUsers;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useUsers = ({ config }: UseUsersOptions = {}) => {
  return useQuery<ApiFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
