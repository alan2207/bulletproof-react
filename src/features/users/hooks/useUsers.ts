import { useQuery } from 'react-query';

import { QueryConfig } from '@/lib/react-query';

import { getUsers } from '../api';

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
