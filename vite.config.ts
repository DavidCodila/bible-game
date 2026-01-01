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
    clearMocks: true, 
    mockReset: false,
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});