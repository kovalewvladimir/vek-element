import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Vue(), ElementPlus({}), UnoCSS()],

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts')
      },
      formats: ['es']
    },

    sourcemap: true,

    rollupOptions: {
      // Библиотека, которую мы хотим использовать в качестве внешней зависимости
      external: [
        'vue',

        // Element Plus
        'element-plus',
        /element-plus\/es\/components\/.*\/style\/css/
      ]
    }
  }
})
