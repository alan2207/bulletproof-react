import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Meta, Project } from '@/types/api';

export const getProjects = (
  page = 1,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
  return api.get(`/projects`, {
    params: {
      page,
    },
  });
};

export const getProjectsQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['projects', { page }] : ['projects'],
    queryFn: () => getProjects(page),
  });
};

type UseProjectsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({ queryConfig, page }: UseProjectsOptions) => {
  return useQuery({
    ...getProjectsQueryOptions({ page }),
    ...queryConfig,
  });
};
