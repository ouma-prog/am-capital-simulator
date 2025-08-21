import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuration de Vitest (tests unitaires) avec support React
export default defineConfig({
  // Active le plugin React de Vite
  plugins: [react()],

  // Options spécifiques à Vitest
  test: {
    // Simule un navigateur (DOM, events…) grâce à jsdom
    environment: 'jsdom',

    // Permet d’utiliser des globals comme describe/test/expect sans import
    globals: true,

    // Fichier de setup exécuté avant chaque suite de tests
    // => pratique pour configurer React Testing Library, jest-dom, etc.
    setupFiles: './vitest.setup.ts'
  }
});
