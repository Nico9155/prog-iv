import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Redirige transparentemente las peticiones '/api' al backend de Node
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
