import * as Sentry from '@sentry/react';
import type { AxiosError } from 'axios';

const sentryCapture = (error: Error) => {
  Sentry.withScope((scope) => {
    scope.setLevel(Sentry.Severity.Error);
    Sentry.captureException(error);
  });
};

const isAxiosError = (variableToCheck: Error | AxiosError): variableToCheck is AxiosError =>
  (variableToCheck as AxiosError).isAxiosError !== undefined;

export const errorHandler = (error: Error | AxiosError) => {
  // Handle Axios interceptor error object
  if (isAxiosError(error)) {
    // Filter 401 & 500 from auth interceptor (as there is a redirection)
    if (error.response?.status === 401 || error.response?.status === 500) return;
    if (error.code === 'ECONNABORTED') return;
    sentryCapture(error);
  } else {
    sentryCapture(error);
  }
};
