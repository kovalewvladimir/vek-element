import path from 'node:path'

import { defineConfig } from 'vite'

const __dirname = import.meta.dirname

/**
 * Сборка подпути `@vek-element/ui/vite`.
 *
 * Кит целиком поставляется исходниками, но эта точка входа — build-time: её грузит сам Node
 * при чтении `vite.config.ts` потребителя (bare-импорты из конфига vite помечает как external),
 * поэтому она обязана быть скомпилированным JS, а не TypeScript.
 *
 * Тулинг тот же, что у `@vek-element/vite-svg`.
 */
export default defineConfig({
  build: {
    outDir: 'dist/vite',

    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/vite/index.ts')
      },
      formats: ['es']
    },

    sourcemap: true,

    rollupOptions: {
      // Всё, что не наш код, — внешнее: рантайм-зависимостей у точки входа нет.
      external: ['node:fs', 'node:module', 'node:path', 'unplugin-element-plus/vite', 'vite']
    }
  }
})
