import { z } from 'zod';

/**
 * Runtime-validated environment configuration.
 *
 * Nothing in the app should read `import.meta.env` directly - import `env`
 * from here instead. That keeps every environment variable in one place and
 * fails loudly at startup instead of silently producing `undefined` deep
 * inside a request.
 */
const EnvSchema = z.object({
  API_URL: z.string().url(),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const createEnv = () => {
  const envVars = {
    API_URL: import.meta.env.VITE_APP_API_URL,
    APP_ENV: import.meta.env.VITE_APP_ENV,
  };

  const parsed = EnvSchema.safeParse(envVars);

  if (!parsed.success) {
    throw new Error(
      [
        'Invalid environment variables:',
        ...Object.entries(parsed.error.flatten().fieldErrors).map(
          ([key, errors]) => `  - VITE_APP_${key}: ${errors?.join(', ')}`,
        ),
        '',
        'Copy .env.example to .env and fill in the missing values.',
      ].join('\n'),
    );
  }

  return parsed.data;
};

export const env = createEnv();
