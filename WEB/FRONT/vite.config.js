import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const apiPaths = ['/auth', '/customer', '/orders', '/scheduling', '/occurrences', '/message-template']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const backendTarget = env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: Object.fromEntries(
        apiPaths.map((path) => [path, { target: backendTarget, changeOrigin: true }])
      ),
    },
  }
})
