import path from 'node:path'

import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

const __dirname = import.meta.dirname

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8999,
    allowedHosts: true
  },

  plugins: [
    Vue(),
    ElementPlus({
      include: ['**/*.vue', '**/*.ts'],
      exclude: [/node_modules\/(?!@vek-element\/ui)/, /[/\\]\.git[/\\]/, /[/\\]\.nuxt[/\\]/]
    }),
    UnoCSS(),
    SvgIcons({
      iconDirs: [path.resolve(__dirname, './src/assets/svgs')],
      symbolId: 'icon-[name]'
    })
  ],

  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  }
})
