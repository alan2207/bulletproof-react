/// <reference types="vite/client" />

/**
 * Raw env vars as Vite injects them: always `string | undefined`, never parsed.
 * Do not read these directly - import the validated `env` object from
 * `@/config/env` instead, which guarantees presence and shape.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string | undefined;
  readonly VITE_APP_NAME: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
