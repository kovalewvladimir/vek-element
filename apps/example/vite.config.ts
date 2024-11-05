import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'
import Checker from 'vite-plugin-checker'
import SvgLoader from 'vite-svg-loader'

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
        lintCommand: 'eslint'
      }
    })
  ],

  server: {
    host: '0.0.0.0',
    port: 8999
  },

  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
  }
})