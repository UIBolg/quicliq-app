import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Published under GitHub Pages at /quicliq-app/web/ (the Expo app owns /quicliq-app/).
export default defineConfig({
  base: '/quicliq-app/web/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // Shared with the Expo app: copy (i18n), icons, illustrations, demo data, formatters.
      '@shared': path.resolve(import.meta.dirname, '../src'),
      '@assets': path.resolve(import.meta.dirname, '../assets'),
    },
  },
  server: { fs: { allow: ['..'] } },
});
