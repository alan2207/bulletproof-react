import { z } from 'zod';

/**
 * Runtime configuration.
 *
 * Every environment variable the app is allowed to read is declared in the
 * schema below. Reading `import.meta.env` directly anywhere else is a bug: it
 * bypasses validation and lets a typo or a missing value fail silently, deep
 * inside a feature, long after startup.
 *
 * Instead this module parses the whole environment once, at import time, and
 * throws a single readable error listing exactly what is wrong. `src/main.tsx`
 * catches that error and renders it, so a misconfigured app shows a
 * configuration screen instead of a blank page.
 *
 * To add a variable: add it to the schema, add it to `.env.example`, and add it
 * to `ImportMetaEnv` in `src/vite-env.d.ts`.
 */

/** Vite only exposes variables to the client if they carry this prefix. */
const ENV_PREFIX = 'VITE_';

const EnvSchema = z.object({
  /** Base URL of the REST backend, e.g. `https://api.example.com`. */
  API_URL: z
    .string()
    .url('must be a valid absolute URL, e.g. https://api.example.com'),

  /** How long a request may run before it is aborted, in milliseconds. */
  API_TIMEOUT_MS: z.coerce
    .number()
    .int('must be a whole number of milliseconds')
    .positive('must be greater than 0')
    .default(15_000),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Collects the prefixed variables and strips the prefix, so the schema can talk
 * about `API_URL` while `.env` files keep the `VITE_` convention.
 *
 * A variable that is present but blank (`VITE_API_URL=`) is treated as absent —
 * an empty string is almost never a value someone meant to set, and reporting it
 * as missing is far more useful than reporting it as an invalid URL.
 */
const readRawEnv = (): Record<string, string> => {
  const raw: Record<string, string> = {};

  for (const [key, value] of Object.entries(import.meta.env)) {
    if (!key.startsWith(ENV_PREFIX)) continue;
    if (typeof value !== 'string' || value.trim() === '') continue;

    raw[key.slice(ENV_PREFIX.length)] = value;
  }

  return raw;
};

const formatIssue = (issue: z.ZodIssue): string => {
  const name = `${ENV_PREFIX}${issue.path.join('.')}`;
  const missing = issue.code === 'invalid_type' && issue.received === 'undefined';

  return `  - ${name}: ${missing ? 'is required but was not set' : issue.message}`;
};

const parseEnv = (): Env => {
  const parsed = EnvSchema.safeParse(readRawEnv());

  if (parsed.success) return parsed.data;

  throw new Error(
    [
      'Invalid environment configuration:',
      '',
      parsed.error.issues.map(formatIssue).join('\n'),
      '',
      'Copy .env.example to .env, fill in the values above, and restart the dev',
      `server. Only variables prefixed with "${ENV_PREFIX}" are visible to the app.`,
    ].join('\n'),
  );
};

export const env = parseEnv();
