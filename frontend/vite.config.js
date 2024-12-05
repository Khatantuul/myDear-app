import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': env.VITE_API_BASE_URL || 'http://localhost:9000', 
      },
    },
  };
});