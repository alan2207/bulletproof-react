import { ButtonHTMLAttributes, forwardRef } from 'react';

import { Spinner } from '@/components/ui/spinner';

import styles from './button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      isLoading = false,
      disabled = false,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      <span>{children}</span>
    </button>
  ),
);

Button.displayName = 'Button';
