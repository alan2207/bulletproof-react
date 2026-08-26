import { useId, type TextareaHTMLAttributes } from 'react';

import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from '@/components/ui/form/field-wrapper';
import { cn } from '@/utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldWrapperPassThroughProps;

export const Textarea = ({
  label,
  error,
  description,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FieldWrapper
      id={textareaId}
      label={label}
      error={error}
      description={description}
    >
      <textarea
        id={textareaId}
        rows={rows}
        className={cn('input', 'textarea', error && 'input--invalid', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          cn(
            description && `${textareaId}-description`,
            error && `${textareaId}-error`,
          ) || undefined
        }
        {...props}
      />
    </FieldWrapper>
  );
};
