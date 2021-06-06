import { useQuery } from 'react-query';

import { getUsers } from '../api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
