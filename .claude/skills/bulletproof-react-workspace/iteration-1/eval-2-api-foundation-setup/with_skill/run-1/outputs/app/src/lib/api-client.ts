import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

/**
 * Auth is cookie based: the API sets an HttpOnly session cookie that client
 * JavaScript can neither read nor leak. All the client has to do is send
 * credentials with every request.
 */
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrap the payload so fetchers are typed `Promise<Discussion>` rather than
  // `Promise<AxiosResponse<Discussion>>` — components never see transport details.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Every failed call surfaces a notification from one place; individual
    // components and hooks do not try/catch requests.
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      const loginHref = paths.auth.login.getHref(redirectTo);

      // Guard against a redirect loop when the login request itself 401s.
      if (window.location.pathname !== paths.auth.login.path) {
        window.location.href = loginHref;
      }
    }

    return Promise.reject(error);
  },
);
