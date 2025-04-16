import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/utils/cn';

export type ErrorProps = {
  errorMessage?: string | null;
} & ComponentPropsWithoutRef<'div'>;

export const Error = ({ errorMessage, className }: ErrorProps) => {
  if (!errorMessage) return null;

  return (
    <div
      role="alert"
      aria-label={errorMessage}
      className={cn('text-sm font-semibold text-red-500', className)}
    >
      {errorMessage}
    </div>
  );
};
