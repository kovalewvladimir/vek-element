import fs from 'node:fs'
import path from 'node:path'

import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig, type Plugin } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

const __dirname = import.meta.dirname

/**
 * GitHub Pages отдаёт сайт из подпути (https://<user>.github.io/<repo>/),
 * поэтому в CI прокидываем BASE_PATH=/vek-element/. Локально остаётся '/'.
 */
const base = process.env.BASE_PATH ?? '/'

/**
 * SPA-fallback для GitHub Pages: статика не умеет отдавать index.html
 * на произвольный путь, но на несуществующий путь отдаёт 404.html.
 * Кладём туда копию index.html — дальше маршрут разбирает vue-router.
 */
const spaFallback = (): Plugin => {
  let outDir = 'dist'

  return {
    name: 'vek-spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      fs.copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
    }
  }
}

export default defineConfig({
  base,

  server: {
    host: '0.0.0.0',
    port: 8999,
    allowedHosts: true
  },

  plugins: [
    Vue(),
    VueDevTools(),
    ElementPlus({
      include: ['**/*.vue', '**/*.ts'],
      exclude: [/node_modules\/(?!@vek-element\/ui)/, /[/\\]\.git[/\\]/, /[/\\]\.nuxt[/\\]/]
    }),
    UnoCSS(),
    SvgIcons({
      iconDirs: [path.resolve(__dirname, './src/assets/svgs')],
      symbolId: 'icon-[name]'
    }),
    spaFallback()
  ],

  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  }
})
