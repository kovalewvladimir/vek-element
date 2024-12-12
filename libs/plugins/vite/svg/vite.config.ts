import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts')
      },
      formats: ['es']
    },

    sourcemap: true,

    rollupOptions: {
      // Библиотека, которую мы хотим использовать в качестве внешней зависимости
      external: ['xml2js', 'vite', 'fs', 'fast-glob', 'pathe']
    }
  }
})
