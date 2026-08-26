import Axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';

/**
 * Normalised error thrown by every request that fails.
 *
 * Feature code should never have to know that axios exists: it catches
 * `ApiError` and reads `message` / `status`.
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, options?: { status?: number; data?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.data = options?.data;
  }
}

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  // Cookie-based sessions; swap for an Authorization header if the API
  // moves to bearer tokens.
  config.withCredentials = true;
  return config;
};

const axiosInstance = Axios.create({
  baseURL: env.API_URL,
});

axiosInstance.interceptors.request.use(requestInterceptor);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';

    return Promise.reject(
      new ApiError(message, {
        status: error.response?.status,
        data: error.response?.data,
      }),
    );
  },
);

/**
 * Thin, typed wrapper around the axios instance.
 *
 * It unwraps `response.data` so call sites read as `const tasks = await
 * api.get<Task[]>('/tasks')` while keeping the return type honest.
 */
export const api = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<TResponse>(url, config).then((res) => res.data),

  post: <TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.post<TResponse>(url, data, config).then((res) => res.data),

  put: <TResponse>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<TResponse>(url, data, config).then((res) => res.data),

  patch: <TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.patch<TResponse>(url, data, config).then((res) => res.data),

  delete: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<TResponse>(url, config).then((res) => res.data),
};
