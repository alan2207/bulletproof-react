import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirrors the `@/*` -> `./src/*` mapping in tsconfig.json, so imports stay
    // stable no matter how deeply nested the importing file is.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
