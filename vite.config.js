import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './index.html',
        segunda: './pages/galeria.html',
      },
    }
  },
  
});
