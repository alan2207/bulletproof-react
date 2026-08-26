import { cn } from '@/utils/cn';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
};

export const Spinner = ({
  size = 'md',
  className,
  label = 'Loading',
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('spinner', `spinner--${size}`, className)}
    />
  );
};
