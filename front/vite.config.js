import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/productos': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/confesiones': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
