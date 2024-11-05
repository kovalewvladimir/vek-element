import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'
import Checker from 'vite-plugin-checker'
import SvgLoader from 'vite-svg-loader'

console.log(__dirname)

export default defineConfig({
  plugins: [
    Vue(),

    ElementPlus({}),
    UnoCSS(),

    SvgLoader(),

    Checker({
      vueTsc: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./**"'
      }
    })
  ],

  server: {
    host: '0.0.0.0',
    port: 8999
  },

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        utils: resolve(__dirname, 'src/lib/utils/index.ts')
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
  },

  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '~', replacement: resolve(__dirname, './src/lib') },
      {
        find: 'element-plus-aa',
        replacement: resolve(__dirname, './src/lib')
      }
    ]
  }
})
