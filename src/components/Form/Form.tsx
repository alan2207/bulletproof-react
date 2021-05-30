import clsx from 'clsx';
import { ReactNode } from 'react';
import { useForm, UseFormReturn, SubmitHandler, UseFormProps } from 'react-hook-form';

type FormProps<TFormValues> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => ReactNode;
  options?: UseFormProps<TFormValues>;
};

export const Form = <TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  children,
  className,
  options,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>(options);
  return (
    <form className={clsx('space-y-6', className)} onSubmit={methods.handleSubmit(onSubmit)}>
      {children(methods)}
    </form>
  );
};
