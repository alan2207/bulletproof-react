import * as React from 'react';
import { z } from 'zod';

/**
 * The app's form abstraction. Feature code depends on THIS interface, not on a
 * form library — so adopting react-hook-form (or anything else) later is a
 * change to this folder only.
 *
 * The zod schema is the same one the API mutation file exports, which keeps
 * client-side validation and request validation from drifting apart.
 */
export type FormFieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

type FormRenderProps<TValues> = {
  errors: FormFieldErrors<TValues>;
};

type FormProps<TSchema extends z.ZodTypeAny> = {
  id?: string;
  className?: string;
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => unknown;
  children: (props: FormRenderProps<z.infer<TSchema>>) => React.ReactNode;
};

export const Form = <TSchema extends z.ZodTypeAny>({
  id,
  className,
  schema,
  onSubmit,
  children,
}: FormProps<TSchema>) => {
  type Errors = FormFieldErrors<z.infer<TSchema>>;

  const [errors, setErrors] = React.useState<Errors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Captured before any await — React clears currentTarget after the handler.
    const formElement = event.currentTarget;
    const values = Object.fromEntries(new FormData(formElement));
    const result = schema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        ) as Errors,
      );
      return;
    }

    setErrors({});

    try {
      await onSubmit(result.data);
      formElement.reset();
    } catch {
      // Request failures are already surfaced by the api-client's response
      // interceptor; the form just keeps the user's input.
    }
  };

  return (
    <form id={id} className={className} onSubmit={handleSubmit} noValidate>
      {children({ errors })}
    </form>
  );
};
