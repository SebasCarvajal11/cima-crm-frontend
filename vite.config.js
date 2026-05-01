import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import oxlintPlugin from 'vite-plugin-oxlint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    oxlintPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          ui: ['@mui/material', '@mui/icons-material', '@chakra-ui/react', 'framer-motion']
        }
      }
    }
  }
})
