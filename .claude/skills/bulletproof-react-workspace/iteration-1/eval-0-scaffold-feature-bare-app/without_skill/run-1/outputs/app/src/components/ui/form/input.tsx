import { useId, type InputHTMLAttributes } from 'react';

import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from '@/components/ui/form/field-wrapper';
import { cn } from '@/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

export const Input = ({
  label,
  error,
  description,
  className,
  id,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldWrapper
      id={inputId}
      label={label}
      error={error}
      description={description}
    >
      <input
        id={inputId}
        className={cn('input', error && 'input--invalid', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          cn(
            description && `${inputId}-description`,
            error && `${inputId}-error`,
          ) || undefined
        }
        {...props}
      />
    </FieldWrapper>
  );
};
