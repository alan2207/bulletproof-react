import { z } from 'zod';

/**
 * Env vars are parsed once, at startup, through a zod schema. The app fails
 * fast with a readable message instead of misbehaving later at runtime.
 *
 * Nothing else in the app reads `import.meta.env` directly — import `env`.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().min(1),
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
  .join('\n')}`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
