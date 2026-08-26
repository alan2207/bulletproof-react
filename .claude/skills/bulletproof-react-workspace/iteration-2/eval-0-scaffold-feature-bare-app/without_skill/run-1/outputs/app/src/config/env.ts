import { z } from 'zod';

/**
 * Environment variables are validated once, at startup, so a misconfigured
 * deploy fails loudly here instead of as a confusing runtime error later.
 * Nothing else in the app should read `import.meta.env` directly.
 */
const envSchema = z.object({
  API_URL: z.string().default(''),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse({
    API_URL: import.meta.env.VITE_API_URL,
    APP_ENV: import.meta.env.VITE_APP_ENV,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - VITE_${String(issue.path[0])}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return result.data;
};

export const env = parseEnv();
