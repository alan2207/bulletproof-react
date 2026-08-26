import * as z from 'zod';

/**
 * Environment variables are parsed once, at startup, through a zod schema.
 *
 * Vite only exposes variables prefixed with `VITE_`; we use `VITE_APP_` and
 * strip the prefix so the rest of the app reads `env.API_URL`.
 *
 * If anything is missing or malformed the app fails immediately with a message
 * naming the offending variables — instead of misbehaving later with an
 * `undefined` base URL and a pile of confusing 404s.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1, 'Required — the REST API base URL'),
  });

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (key.startsWith('VITE_APP_')) {
        acc[key.replace('VITE_APP_', '')] = value as string;
      }
      return acc;
    },
    {},
  );

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    const issues = Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([key, errors]) => `  - VITE_APP_${key}: ${errors?.join(', ')}`)
      .join('\n');

    throw new Error(
      [
        'Invalid environment configuration.',
        'The following variables are missing or invalid:',
        issues,
        '',
        'Copy `.env.example` to `.env`, fill in the values, and restart the dev server.',
      ].join('\n'),
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
