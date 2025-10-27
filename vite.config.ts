import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@features': '/src/features',
      '@shared': '/src/shared',
    },
  },
  build: {
    // Optimize bundle splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['formik', 'yup'],
        },
      },
    },
    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',
    // Enable gzip compression hint
    reportCompressedSize: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize development performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
      '@tanstack/react-query',
      'formik',
      'yup',
    ],
  },
  // Improve server performance
  server: {
    hmr: {
      overlay: false,
    },
  },
})
