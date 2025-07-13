import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspect(), // Vite plugin inspector - localhost:5173/__inspect/
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'P',
        short_name: 'P',
        description: 'A Progressive Web App for Psychologists',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['medical', 'productivity', 'business'],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Mantine UI chunk
          'mantine-vendor': [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/notifications',
            '@mantine/dates',
            '@mantine/form',
            '@mantine/modals',
          ],
          // Icons chunk
          'icons-vendor': ['@tabler/icons-react'],
          // Database chunk
          'db-vendor': ['dexie'],
          // State management chunk
          'state-vendor': ['zustand', 'immer'],
          // Utils chunk
          'utils-vendor': ['date-fns', 'dayjs', 'zod'],
        },
      },
    },
  },
});
