import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

/**
 * The single pre-configured API client for the whole app. Everything requests
 * share — auth headers, response unwrapping, error surfacing — lives here, so
 * endpoint files stay three lines long and components never see transport.
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is why fetchers are typed `Promise<Task>` rather than
  // `Promise<AxiosResponse<Task>>`.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    // When an auth feature is added, redirect 401s to the login route here
    // via paths.auth.login.getHref(redirectTo).

    return Promise.reject(error);
  },
);
