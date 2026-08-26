import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './button.module.css';
import { Spinner } from './spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  type = 'button',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(styles.button, styles[variant], className)}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading && <Spinner size="sm" />}
    <span>{children}</span>
  </button>
);
