import styles from './spinner.module.css';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'xl';
  label?: string;
};

export const Spinner = ({ size = 'md', label = 'Loading' }: SpinnerProps) => (
  <span
    role="status"
    aria-label={label}
    className={`${styles.spinner} ${styles[size]}`}
  />
);
