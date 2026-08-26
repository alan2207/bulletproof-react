/// <reference types="vite/client" />

/**
 * Declared for editor support only. The single source of truth for what the app
 * requires at runtime is the zod schema in `src/config/env.ts` — read values
 * from `env` there, never from `import.meta.env` directly.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
