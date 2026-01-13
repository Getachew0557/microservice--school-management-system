// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/api/students': {
//         target: 'http://localhost:3001',
//         changeOrigin: true,
//       },
//       '/api/teachers': {
//         target: 'http://localhost:3002',
//         changeOrigin: true,
//       },
//       '/api/courses': {
//         target: 'http://localhost:3003',
//         changeOrigin: true,
//       },
//       '/api/grades': {
//         target: 'http://localhost:3004',
//         changeOrigin: true,
//       },
//     },
//   },
//   build: {
//     outDir: 'build',
//     sourcemap: true,
//   }
//   })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      // Optional: Proxy API calls during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', '@tanstack/react-query']
        }
      }
    }
  }
})