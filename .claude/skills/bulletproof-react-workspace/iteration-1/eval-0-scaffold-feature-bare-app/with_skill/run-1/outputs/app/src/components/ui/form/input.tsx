import * as React from 'react';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

export const Input = ({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}: InputProps) => {
  return (
    <FieldWrapper label={label} error={error}>
      <input type={type} className={`input ${className}`.trim()} {...props} />
    </FieldWrapper>
  );
};
