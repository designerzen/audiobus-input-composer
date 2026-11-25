import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'site',
    target: 'es2022',
    rollupOptions: { input: { main: 'index.html', gallery: 'gallery.html' } },
  },
});
