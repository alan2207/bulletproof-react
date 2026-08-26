import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import type { ApiErrorResponse } from '@/types/api';

/**
 * Every failed request surfaces as an `ApiError`, so UI code can rely on
 * `error.message` / `error.status` without knowing that axios exists.
 */
export class ApiError extends Error {
  readonly status?: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const withDefaultHeaders = (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = 'application/json';
  return config;
};

/**
 * The single axios instance for the whole app. Features never create their own
 * client — auth headers, base URL and error normalisation are configured once,
 * here.
 */
export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(withDefaultHeaders);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';

    return Promise.reject(
      new ApiError(
        message,
        error.response?.status,
        error.response?.data?.errors,
      ),
    );
  },
);
