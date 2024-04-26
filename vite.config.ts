import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const dotenv = loadEnv(mode, process.cwd());
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(), svgr({ svgrOptions: { icon: true } })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env': {
        NODE_ENV: process.env.NODE_ENV,
        ...dotenv,
      },
    },
  };
});
