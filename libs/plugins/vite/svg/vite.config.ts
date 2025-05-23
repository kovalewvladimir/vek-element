import path from 'node:path'

import { defineConfig } from 'vite'

const __dirname = import.meta.dirname

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts')
      },
      formats: ['es']
    },

    sourcemap: true,

    rollupOptions: {
      // Библиотека, которую мы хотим использовать в качестве внешней зависимости
      external: ['xml2js', 'vite', 'node:fs', 'fast-glob', 'pathe']
    }
  }
})
