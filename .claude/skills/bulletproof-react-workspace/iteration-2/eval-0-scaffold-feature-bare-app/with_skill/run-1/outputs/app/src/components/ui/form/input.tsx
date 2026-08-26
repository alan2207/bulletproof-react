import { InputHTMLAttributes } from 'react';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';
import styles from './form.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

export const Input = ({ label, error, ...props }: InputProps) => (
  <FieldWrapper label={label} error={error}>
    <input
      className={styles.input}
      aria-invalid={Boolean(error)}
      type="text"
      {...props}
    />
  </FieldWrapper>
);
