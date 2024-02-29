import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import * as React from 'react';
import { useForm, UseFormReturn, SubmitHandler, UseFormProps } from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';

type FormProps<TFormValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  schema?: Schema;
} & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>;

export const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>
>({
  onSubmit,
  children,
  className,
  options,
  schema,
  ...rest
}: FormProps<TFormValues, Schema>) => {
  const methods = useForm<TFormValues>({ ...options, resolver: schema && zodResolver(schema) });
  return (
    <form
      {...rest}
      className={clsx('space-y-6', className)}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      {children(methods)}
    </form>
  );
};
