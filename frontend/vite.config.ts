import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/money_calculators/',
  build: {
    chunkSizeWarningLimit: 600, // Suppress warning for chunks up to 600 kB
  },
});