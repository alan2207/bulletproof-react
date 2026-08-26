import type { ReactNode } from 'react';

export type FieldWrapperPassThroughProps = {
  label: string;
  error?: string;
  description?: string;
};

type FieldWrapperProps = FieldWrapperPassThroughProps & {
  id: string;
  children: ReactNode;
};

/**
 * Owns the label / description / error layout so every input in the app
 * gets the same markup and the same a11y wiring.
 */
export const FieldWrapper = ({
  id,
  label,
  error,
  description,
  children,
}: FieldWrapperProps) => {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {description && (
        <p className="field__description" id={`${id}-description`}>
          {description}
        </p>
      )}
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
