import Axios, { InternalAxiosRequestConfig } from 'axios';

import { notificationsStore } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

/**
 * The one API client instance for the whole app. Endpoint files under
 * `features/<feature>/api/` are the only place it should be imported.
 */
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is what lets fetchers be typed `Promise<Task[]>` instead
  // of `Promise<AxiosResponse<Task[]>>` — components never see transport types.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    notificationsStore.addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      // Point this at `paths.auth.login.getHref(redirectTo)` once auth exists.
      const redirectTo = window.location.pathname;
      if (redirectTo !== paths.home.getHref()) {
        window.location.href = paths.home.getHref();
      }
    }

    return Promise.reject(error);
  },
);
