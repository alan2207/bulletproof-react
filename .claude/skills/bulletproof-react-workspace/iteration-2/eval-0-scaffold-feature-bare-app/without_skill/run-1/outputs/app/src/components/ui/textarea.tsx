import { useId, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './field.module.css';

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id'
> & {
  label: string;
  error?: string;
};

export const Textarea = ({
  label,
  error,
  className,
  ...props
}: TextareaProps) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          styles.control,
          styles.textarea,
          error && styles.controlInvalid,
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};
