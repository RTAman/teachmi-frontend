import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      // 개발 중 /api 요청을 백엔드로 전달합니다. 같은 주소처럼 동작해 로그인 쿠키가 유지됩니다.
      proxy: target ? { '/api': { target, changeOrigin: true } } : undefined,
    },
  };
});
