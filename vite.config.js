import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  root: '.',
  plugins: [
    {
      name: 'trailing-slash-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/aula-particular') {
            res.writeHead(301, { Location: '/aula-particular/' })
            res.end()
            return
          }
          next()
        })
      },
    },
    ViteImageOptimizer({
      png: { quality: 75 },
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      webp: { lossless: false, quality: 75 },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'cleanupIDs', active: false },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        home: 'index.html',
        'aula-particular': 'aula-particular/index.html',
      },
      output: {
        manualChunks: {
          vendor: ['animejs', 'bootstrap'],
        },
      },
    },
  },
  server: {
    open: true,
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./js/tests/setup.ts'],
    include: ['js/tests/shared/**/*.test.ts', 'js/tests/home/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['js/*.ts'],
      exclude: ['js/tests/**', 'js/declarations.d.ts', 'js/main.ts'],
    },
  },
})
