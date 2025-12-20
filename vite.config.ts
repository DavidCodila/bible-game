import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  // @ts-ignore - Vitest uses this block
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
});