import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  QueryFunction,
  MutationFunction,
  UseMutationOptions,
} from '@tanstack/react-query';
import React from 'react';

export interface ReactQueryAuthConfig<User, LoginCredentials, RegisterCredentials> {
  userFn: QueryFunction<User, QueryKey>;
  loginFn: MutationFunction<User, LoginCredentials>;
  registerFn: MutationFunction<User, RegisterCredentials>;
  logoutFn: MutationFunction<unknown, unknown>;
  userKey?: QueryKey;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function configureAuth<User, Error, LoginCredentials, RegisterCredentials>(
  config: ReactQueryAuthConfig<User, LoginCredentials, RegisterCredentials>
) {
  const { userFn, userKey = ['authenticated-user'], loginFn, registerFn, logoutFn } = config;

  const useUser = (
    options?: Omit<UseQueryOptions<User, Error, User, QueryKey>, 'queryKey' | 'queryFn'>
  ) => useQuery({ queryKey: userKey, queryFn: userFn, ...options });

  const useLogin = (
    options?: Omit<UseMutationOptions<User, Error, LoginCredentials>, 'mutationFn'>
  ) => {
    const queryClient = useQueryClient();

    const setUser = React.useCallback(
      (data: User) => queryClient.setQueryData(userKey, data),
      [queryClient]
    );

    return useMutation({
      mutationFn: loginFn,
      ...options,
      onSuccess: (user, ...rest) => {
        setUser(user);
        options?.onSuccess?.(user, ...rest);
      },
    });
  };

  const useRegister = (
    options?: Omit<UseMutationOptions<User, Error, RegisterCredentials>, 'mutationFn'>
  ) => {
    const queryClient = useQueryClient();

    const setUser = React.useCallback(
      (data: User) => queryClient.setQueryData(userKey, data),
      [queryClient]
    );

    return useMutation({
      mutationFn: registerFn,
      ...options,
      onSuccess: (user, ...rest) => {
        setUser(user);
        options?.onSuccess?.(user, ...rest);
      },
    });
  };

  const useLogout = (options?: UseMutationOptions<unknown, Error, unknown>) => {
    const queryClient = useQueryClient();

    const setUser = React.useCallback(
      (data: User | null) => queryClient.setQueryData(userKey, data),
      [queryClient]
    );

    return useMutation({
      mutationFn: logoutFn,
      ...options,
      onSuccess: (...args) => {
        setUser(null);
        options?.onSuccess?.(...args);
      },
    });
  };

  function AuthLoader({
    children,
    renderLoading,
    renderUnauthenticated,
    renderError = (error: Error) => <>{JSON.stringify(error)}</>,
  }: {
    children: React.ReactNode;
    renderLoading: () => JSX.Element;
    renderUnauthenticated?: () => JSX.Element;
    renderError?: (error: Error) => JSX.Element;
  }) {
    const { isSuccess, isFetched, status, data, error } = useUser();

    if (isSuccess) {
      if (renderUnauthenticated && !data) {
        return renderUnauthenticated();
      }
      return <>{children}</>;
    }

    if (!isFetched) {
      return renderLoading();
    }

    if (status === 'error') {
      return renderError(error);
    }

    return null;
  }

  return {
    useUser,
    useLogin,
    useRegister,
    useLogout,
    AuthLoader,
  };
}
