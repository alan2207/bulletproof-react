import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { showNotification } from '@/components/ui/notifications/notifications-store';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { type ApiErrorResponse } from '@/types/api';

/**
 * The single HTTP entry point for the app.
 *
 * Features never construct their own axios instance. Everything that has to be
 * true of every request — credentials, timeouts, error reporting, session
 * expiry — is configured once, here.
 */

/** Per-request escape hatches for the automatic error handling. */
type ApiRequestFlags = {
  /**
   * Suppresses the error notification for this request. Use it when the caller
   * renders the failure itself (inline form errors, an empty state, a probe
   * request that is expected to fail).
   */
  skipErrorNotification?: boolean;
  /** Suppresses the redirect to login on a 401. */
  skipAuthRedirect?: boolean;
};

export type ApiRequestConfig = AxiosRequestConfig & ApiRequestFlags;

/**
 * What a failed response body might actually contain. A well-behaved backend
 * sends `ApiErrorResponse`, but a proxy returns an HTML string and a 504 may
 * send nothing at all — the union keeps the narrowing below honest.
 */
type ApiErrorBody = ApiErrorResponse | string | undefined;

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
};

export const apiClient = Axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT_MS,

  // Auth is cookie based: the browser must send the session cookie on every
  // call, including cross-origin ones. This requires the backend to answer with
  // `Access-Control-Allow-Credentials: true` and an explicit origin (not `*`).
  withCredentials: true,

  // Double-submit CSRF protection, which cookie auth generally needs. Axios
  // copies the `XSRF-TOKEN` cookie into the `X-XSRF-TOKEN` header; since 1.6.2
  // it only does so cross-origin when `withXSRFToken` is set. If the backend
  // never sets the cookie this is a no-op — nothing is read, nothing is sent.
  // Rename both to match your backend's convention.
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

apiClient.interceptors.request.use(authRequestInterceptor);

/**
 * `error.config` carries whatever the caller passed, including our own flags,
 * but it is typed as an axios config. Reading it through `unknown` keeps the
 * lookup honest instead of asserting a shape axios never promised.
 */
const readFlags = (config: unknown): ApiRequestFlags => {
  if (typeof config !== 'object' || config === null) return {};

  const { skipErrorNotification, skipAuthRedirect } = config as ApiRequestFlags;
  return { skipErrorNotification, skipAuthRedirect };
};

const MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'The server rejected the request.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'That conflicts with something that already exists.',
  422: 'Some of the submitted values are not valid.',
  429: 'Too many requests. Please wait a moment and try again.',
};

const fallbackMessage = (status: number): string => {
  const known = MESSAGE_BY_STATUS[status];
  if (known) return known;

  return status >= 500
    ? 'Something went wrong on our end. Please try again shortly.'
    : 'The request failed. Please try again.';
};

/**
 * Turns whatever the backend (or the network) produced into one sentence a user
 * can act on. Never surfaces a raw stack trace, an HTML page, or
 * `[object Object]`.
 */
const getErrorMessage = (error: AxiosError<ApiErrorBody>): string => {
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The request took too long and was cancelled. Please try again.';
  }

  if (!error.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;

  // A plain-text error body is usable; a gateway's HTML error page is not.
  if (typeof data === 'string') {
    const text = data.trim();

    return text !== '' && !text.startsWith('<') ? text : fallbackMessage(status);
  }

  const fieldErrors = data?.errors;
  const firstFieldError = fieldErrors
    ? Object.values(fieldErrors)
        .flat()
        .find((message) => typeof message === 'string' && message.trim() !== '')
    : undefined;

  return (
    data?.message ?? data?.error ?? firstFieldError ?? fallbackMessage(status)
  );
};

const redirectToLogin = () => {
  const { pathname, search } = window.location;

  // Guard against a redirect loop when the login page itself 401s.
  if (pathname.startsWith(paths.auth.login.path)) return;

  window.location.href = paths.auth.login.getHref(`${pathname}${search}`);
};

apiClient.interceptors.response.use(
  // Unwrap the envelope so callers get the payload, not an `AxiosResponse`.
  // The `api` facade below re-types the methods to match.
  (response) => response.data,

  (error: AxiosError<ApiErrorBody>) => {
    // React Query aborts in-flight queries on unmount and on refetch. Those are
    // not failures and must never reach the user.
    if (Axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const flags = readFlags(error.config);
    const status = error.response?.status;

    // A 401 means the session is gone. Bounce to login instead of showing a
    // toast the user cannot do anything about.
    if (status === 401) {
      if (!flags.skipAuthRedirect) redirectToLogin();
      return Promise.reject(error);
    }

    if (!flags.skipErrorNotification) {
      showNotification({
        type: 'error',
        title: 'Request failed',
        message: getErrorMessage(error),
      });
    }

    return Promise.reject(error);
  },
);

/**
 * Typed facade over the instance.
 *
 * The response interceptor already unwraps `response.data`, so the raw axios
 * methods would keep claiming to return an `AxiosResponse` they no longer
 * return. Passing the payload type as both generics makes the signatures match
 * reality: `api.get<User>(...)` resolves to `User`.
 */
export const api = {
  get: <TData>(url: string, config?: ApiRequestConfig) =>
    apiClient.get<TData, TData>(url, config),

  post: <TData>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    apiClient.post<TData, TData>(url, data, config),

  put: <TData>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    apiClient.put<TData, TData>(url, data, config),

  patch: <TData>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    apiClient.patch<TData, TData>(url, data, config),

  delete: <TData>(url: string, config?: ApiRequestConfig) =>
    apiClient.delete<TData, TData>(url, config),
};
