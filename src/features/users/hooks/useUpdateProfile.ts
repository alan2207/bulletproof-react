import { useMutation } from 'react-query';

import { MutationConfig } from '@/lib/react-query';

import { updateProfile } from '../api';

type UseUpdateProfileOptions = {
  config?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ config }: UseUpdateProfileOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: updateProfile,
  });
};
