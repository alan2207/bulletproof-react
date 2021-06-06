import { useQuery } from 'react-query';

import { getMyTeam } from '../api';

export const useMyTeam = () => {
  return useQuery({
    queryKey: ['my-teams'],
    queryFn: () => getMyTeam(),
  });
};
