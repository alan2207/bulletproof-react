import { cn } from '@/utils/cn';

import styles from './spinner.module.css';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

export const Spinner = ({ size = 'md', label = 'Loading' }: SpinnerProps) => (
  <span
    className={cn(styles.spinner, styles[size])}
    role="status"
    aria-label={label}
  />
);
