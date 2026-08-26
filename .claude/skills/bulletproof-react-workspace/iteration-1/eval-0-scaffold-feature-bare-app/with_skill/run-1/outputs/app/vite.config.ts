import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // mirrors the `@/*` -> `./src/*` mapping in tsconfig.json
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
