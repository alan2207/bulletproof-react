import { z } from 'zod';

/**
 * Single source of truth for runtime configuration.
 *
 * Every env var the app depends on is declared here and validated once, at
 * module load. A missing or malformed variable fails immediately with a message
 * that names the variable and says how to fix it - instead of surfacing later as
 * a request to `undefined/users` or a blank screen.
 *
 * Only `VITE_`-prefixed variables are exposed to the browser by Vite, so that
 * prefix is part of every name below.
 */

/**
 * Accepts an absolute URL (`https://api.example.com`) or a same-origin path
 * (`/api`), which is the usual shape when the backend sits behind the same
 * origin - the common setup for cookie-based auth, since it avoids third-party
 * cookie restrictions entirely.
 */
const apiUrlSchema = z
  .string({ required_error: 'is required (e.g. https://api.example.com or /api)' })
  .min(1, 'must not be empty')
  .refine(
    (value) => {
      if (value.startsWith('/')) return true;
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message:
        'must be an absolute http(s) URL (https://api.example.com) or a same-origin path (/api)',
    },
  )
  // Trailing slashes double up once axios joins a path onto the base URL.
  .transform((value) => value.replace(/\/+$/, ''));

const EnvSchema = z.object({
  VITE_API_URL: apiUrlSchema,
  VITE_APP_NAME: z.string().min(1, 'must not be empty').default('My App'),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Read each variable explicitly rather than handing zod the whole
 * `import.meta.env` object: Vite performs a static find-and-replace on
 * `import.meta.env.VITE_*` at build time, so explicit reads are the only form
 * guaranteed to survive bundling.
 */
const rawEnv = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
};

const formatIssues = (error: z.ZodError): string =>
  Object.entries(error.flatten().fieldErrors)
    .map(([name, issues]) => `  - ${name}: ${issues?.join('; ') ?? 'is invalid'}`)
    .join('\n');

const parseEnv = (): Env => {
  const parsed = EnvSchema.safeParse(rawEnv);

  if (!parsed.success) {
    throw new Error(
      [
        'Invalid environment configuration.',
        '',
        'The following variables are missing or invalid:',
        formatIssues(parsed.error),
        '',
        'Fix: copy `.env.example` to `.env`, fill in the values, and restart the dev server.',
        'Note: only variables prefixed with `VITE_` are exposed to the browser.',
      ].join('\n'),
    );
  }

  return parsed.data;
};

/**
 * Validated, fully-typed config. Import this - never `import.meta.env` - so
 * every consumer gets values that are known to exist and to be well-formed.
 */
export const env = parseEnv();
