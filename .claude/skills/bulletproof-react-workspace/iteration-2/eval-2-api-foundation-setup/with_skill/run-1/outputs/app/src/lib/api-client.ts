import Axios, { type InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

/**
 * Auth is cookie based: the API sets an HttpOnly session cookie, and the client
 * only has to send credentials along with every request. No token is read or
 * stored by JS, so there is nothing for an XSS payload to exfiltrate.
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
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  // Unwrapping here is why fetchers are typed `Promise<Thing>` rather than
  // `Promise<AxiosResponse<Thing>>` — components never see transport details.
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Every failed request notifies once, centrally. Callers don't try/catch.
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);
