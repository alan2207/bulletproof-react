import { useQuery } from 'react-query';

import { getTeams } from '../api';

export const useDiscussions = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });
};
