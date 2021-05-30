import { omit } from 'lodash';

import { axios } from '@/lib/axios';

interface GetOneOptions {
  queryString?: string;
}

interface GetManyOptions {
  id: string;
  queryString?: string;
}

interface CreateOptions {
  values: Record<string, any>;
}

interface UpdateOptions {
  id: string;
  values: Record<string, any>;
}

interface DeleteOptions {
  id: string;
}

type CrudAction = 'getMany' | 'getOne' | 'create' | 'update' | 'delete';

interface CrudEndpointsOptions {
  resource: string;
  omitActions?: CrudAction[];
}

export const makeCrudEndpoints = <T>({ resource, omitActions = [] }: CrudEndpointsOptions) => {
  const endpoints = {
    getMany: ({ queryString = '' }: GetOneOptions = {}): Promise<T[]> =>
      axios.get(resource + `?${queryString}`),
    getOne: ({ id, queryString = '' }: GetManyOptions): Promise<T> =>
      axios.get(`${resource}/${id}?${queryString}`),
    create: ({ values }: CreateOptions): Promise<T> => axios.post(resource, values),
    update: ({ id, values }: UpdateOptions): Promise<T> => axios.patch(`${resource}/${id}`, values),
    delete: ({ id }: DeleteOptions): Promise<T> => axios.delete(`${resource}/${id}`),
  };

  return omit(endpoints, omitActions) as Omit<typeof endpoints, keyof typeof omitActions>;
};
