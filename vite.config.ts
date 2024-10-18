import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      fileName: 'my-components',
      formats: ['es']
    },
    rollupOptions: {
      // Библиотека, которую мы хотим использовать в качестве внешней зависимости
      external: ['vue']
    }
  }
})
