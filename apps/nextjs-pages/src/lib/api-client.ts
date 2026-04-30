import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

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
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams();
        const redirectTo =
          searchParams.get('redirectTo') || window.location.pathname;
        window.location.href = paths.auth.login.getHref(redirectTo);
      }
    }

    return Promise.reject(error);
  },
);

// if the endpoint requires the visiting user to be authenticated,
// attaching cookies is required for requests made on the server side
export const attachCookie = (
  cookie?: string,
  headers?: Record<string, string>,
) => {
  return {
    headers: {
      ...headers,
      ...(cookie ? { Cookie: cookie } : {}),
    },
  };
};
