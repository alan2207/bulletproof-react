import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Spinner } from '@/components/ui/spinner/spinner';
import { cn } from '@/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
  icon?: ReactNode;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : icon}
      <span>{children}</span>
    </button>
  );
};
