import clsx from 'clsx';
import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: ReactNode;
  error?: FieldError | undefined;
  description?: string;
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, 'className' | 'children'>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, className, error, children } = props;
  return (
    <div>
      <label className={clsx('block text-sm font-medium text-gray-700', className)}>
        {label}
        <div className="mt-1">{children}</div>
      </label>
      <div>{error}</div>
    </div>
  );
};
