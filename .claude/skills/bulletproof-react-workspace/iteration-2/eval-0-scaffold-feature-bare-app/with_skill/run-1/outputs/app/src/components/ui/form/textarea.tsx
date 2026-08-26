import { TextareaHTMLAttributes } from 'react';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';
import styles from './form.module.css';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldWrapperPassThroughProps;

export const Textarea = ({ label, error, ...props }: TextareaProps) => (
  <FieldWrapper label={label} error={error}>
    <textarea
      className={`${styles.input} ${styles.textarea}`}
      aria-invalid={Boolean(error)}
      {...props}
    />
  </FieldWrapper>
);
