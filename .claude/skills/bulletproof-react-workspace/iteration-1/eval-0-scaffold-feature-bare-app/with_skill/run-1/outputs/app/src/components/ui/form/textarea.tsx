import * as React from 'react';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldWrapperPassThroughProps;

export const Textarea = ({
  label,
  error,
  className = '',
  rows = 3,
  ...props
}: TextareaProps) => {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea rows={rows} className={`input ${className}`.trim()} {...props} />
    </FieldWrapper>
  );
};
