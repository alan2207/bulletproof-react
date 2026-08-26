import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import type { z } from 'zod';

type FieldErrors<TValues> = Partial<Record<keyof TValues & string, string>>;

type UseZodFormOptions<TValues extends Record<string, string>> = {
  schema: z.ZodType<TValues, z.ZodTypeDef, unknown>;
  initialValues: TValues;
  onSubmit: (values: TValues) => void | Promise<void>;
};

/**
 * Minimal controlled-form helper: the zod schema that describes the request
 * payload is the same schema that validates the form, so client and server
 * rules can never drift apart.
 *
 * Swap the internals for react-hook-form + zodResolver if forms in this app
 * ever outgrow this; the call-site API is deliberately close to it.
 */
export const useZodForm = <TValues extends Record<string, string>>({
  schema,
  initialValues,
  onSubmit,
}: UseZodFormOptions<TValues>) => {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      setValues((current) => ({ ...current, [name]: value }));
      setErrors((current) => {
        if (!(name in current)) return current;
        const next = { ...current };
        delete next[name as keyof TValues & string];
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = schema.safeParse(values);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([field, messages]) => [
              field,
              messages?.[0],
            ]),
          ) as FieldErrors<TValues>,
        );
        return;
      }

      setErrors({});
      await onSubmit(result.data);
    },
    [onSubmit, schema, values],
  );

  return { values, errors, handleChange, handleSubmit, reset, setErrors };
};
