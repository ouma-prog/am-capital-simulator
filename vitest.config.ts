// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'app') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  // Permet de compiler le TSX/JSX sans plugin React
  esbuild: {
    jsx: 'automatic',
    jsxDev: true,
  },
});
