type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

export const Spinner = ({ size = 'md', label = 'Loading' }: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={`spinner spinner--${size}`}
    />
  );
};
