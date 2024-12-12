import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    ElementPlus({}),
    UnoCSS(),
    SvgIcons({
      iconDirs: [resolve(__dirname, './src/assets/svgs')],
      symbolId: 'icon-[name]'
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
