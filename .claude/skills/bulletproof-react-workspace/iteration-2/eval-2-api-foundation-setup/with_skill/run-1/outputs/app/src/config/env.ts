import * as z from 'zod';

/**
 * Environment variables are parsed once, at startup, through a zod schema.
 * A missing or malformed variable fails fast with a readable message instead
 * of surfacing later as `undefined` in a request URL.
 *
 * Convention: every variable is prefixed with `VITE_APP_` in `.env` files and
 * consumed here without the prefix (`VITE_APP_API_URL` -> `env.API_URL`).
 * Nothing else in the app reads `import.meta.env` directly.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1, 'Required'),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
  });

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value as string;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}
Add them to your .env file (prefixed with VITE_APP_) — see .env.example.`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
