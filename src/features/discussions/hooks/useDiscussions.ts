import { useQuery } from 'react-query';

import { getDiscussions } from '../api';

export const useDiscussions = () => {
  return useQuery({
    queryKey: ['discussions'],
    queryFn: () => getDiscussions(),
  });
};
