import * as React from 'react';

export type FieldWrapperProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

/** Props a field component forwards to FieldWrapper rather than to the input. */
export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, 'children'>;

export const FieldWrapper = ({ label, error, children }: FieldWrapperProps) => {
  return (
    <div className="field">
      <label className="field__label">
        <span className="field__label-text">{label}</span>
        {children}
      </label>
      {error ? (
        <p role="alert" className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
};
