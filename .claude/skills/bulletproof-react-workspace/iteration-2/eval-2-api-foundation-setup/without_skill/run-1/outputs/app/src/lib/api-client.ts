import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { notify } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

import { toApiError } from './api-error';

export { ApiError, toApiError } from './api-error';

export type RequestConfig = AxiosRequestConfig & {
  /**
   * Suppress the automatic error toast for this request. Use it when the caller
   * renders the failure itself - inline form validation, a background poll, or
   * a request whose failure is expected and handled.
   */
  skipErrorNotification?: boolean;
};

/**
 * Cookie-based auth: nothing is read from or written to storage in JS, and no
 * Authorization header is attached. The browser sends the session cookie
 * because `withCredentials` is on, which is also what lets the server's
 * `Set-Cookie` stick on the response.
 *
 * The backend must answer with `Access-Control-Allow-Credentials: true` and an
 * explicit origin (a wildcard is rejected by browsers for credentialed
 * requests) unless `VITE_API_URL` is a same-origin path such as `/api`.
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
});

const redirectToLogin = () => {
  const { pathname, search } = window.location;

  // Already on the login screen - redirecting again would only clobber the
  // `redirectTo` we captured the first time.
  if (pathname.startsWith(paths.auth.login.path)) return;

  // A full-page assign rather than a router navigation, deliberately: the
  // session is gone, so every cache still in memory is suspect. Reloading
  // starts from a clean slate, and it works from non-React code like this.
  window.location.assign(paths.auth.login.getHref(`${pathname}${search}`));
};

// `error.config` is typed as axios' internal config, which does not know about
// our custom flag - but axios does carry unknown config keys through untouched.
const shouldNotify = (config: unknown): boolean =>
  !(config as RequestConfig | undefined)?.skipErrorNotification;

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);

    // The single place where a failed request becomes visible to the user, so
    // no feature has to remember to wire up its own `onError`.
    if (shouldNotify(axios.isAxiosError(error) ? error.config : undefined)) {
      notify.error({ title: 'Request failed', message: apiError.message });
    }

    if (apiError.isUnauthorized) {
      redirectToLogin();
    }

    // Reject with the normalised error so react-query and every caller can rely
    // on receiving an `ApiError`.
    return Promise.reject(apiError);
  },
);

/**
 * Thin, typed wrapper over the axios instance.
 *
 * It unwraps `response.data`, so API functions read as `Promise<User>` instead
 * of `Promise<AxiosResponse<User>>`, while still accepting per-request options
 * (`params`, `signal`, `skipErrorNotification`).
 *
 * ```ts
 * export const getUser = (userId: string, config?: RequestConfig) =>
 *   api.get<User>(`/users/${userId}`, config);
 * ```
 */
export const api = {
  get: <TData>(url: string, config?: RequestConfig): Promise<TData> =>
    apiClient.get<TData>(url, config).then((response) => response.data),

  post: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.post<TData>(url, data, config).then((response) => response.data),

  put: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.put<TData>(url, data, config).then((response) => response.data),

  patch: <TData>(url: string, data?: unknown, config?: RequestConfig): Promise<TData> =>
    apiClient.patch<TData>(url, data, config).then((response) => response.data),

  delete: <TData>(url: string, config?: RequestConfig): Promise<TData> =>
    apiClient.delete<TData>(url, config).then((response) => response.data),
};
