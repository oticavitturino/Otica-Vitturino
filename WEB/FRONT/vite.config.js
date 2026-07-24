import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = 'http://localhost:8080'
const apiPaths = ['/auth', '/customer', '/orders', '/scheduling', '/occurrences', '/message-template']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(
      apiPaths.map((path) => [path, { target: backendTarget, changeOrigin: true }])
    ),
  },
})
