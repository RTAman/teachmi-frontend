import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      proxy: target ? { '/api': { target, changeOrigin: true } } : undefined,
    },
  };
});
