import { ReactNode } from 'react';

import styles from './form.module.css';

export type FieldWrapperPassThroughProps = {
  label: string;
  error?: string;
};

type FieldWrapperProps = FieldWrapperPassThroughProps & {
  children: ReactNode;
};

/**
 * Owns the label/error markup so every field renders the same way. Fields stay
 * dumb controls, which is what a react-hook-form `registration` prop would be
 * threaded through if/when the app adopts it.
 */
export const FieldWrapper = ({ label, error, children }: FieldWrapperProps) => (
  <div className={styles.field}>
    <label className={styles.label}>
      {label}
      <div className={styles.control}>{children}</div>
    </label>
    {error ? (
      <p role="alert" className={styles.error}>
        {error}
      </p>
    ) : null}
  </div>
);
