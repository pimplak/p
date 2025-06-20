import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspect(), // Vite plugin inspector - localhost:5173/__inspect/
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Mantine UI chunk  
          'mantine-vendor': ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/dates', '@mantine/form', '@mantine/modals'],
          // Icons chunk
          'icons-vendor': ['@tabler/icons-react'],
          // Database chunk
          'db-vendor': ['dexie'],
          // State management chunk
          'state-vendor': ['zustand', 'immer'],
          // Utils chunk
          'utils-vendor': ['date-fns', 'dayjs', 'zod'],
        }
      }
    }
  }
})
