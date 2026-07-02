import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the preview harness to assign a port via env
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  build: {
    // Keep chunk names readable for easier debugging of deploys
    sourcemap: false,
  },
})
