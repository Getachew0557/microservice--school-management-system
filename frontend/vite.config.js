import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/students': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/teachers': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/api/courses': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/api/grades': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  }
  })