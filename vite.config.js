import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    disabled: false,
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});
