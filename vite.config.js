import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    open: true,
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./js/tests/setup.ts'],
    include: ['js/tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['js/*.ts'],
      exclude: ['js/tests/**', 'js/declarations.d.ts', 'js/main.ts'],
    },
  },
})
