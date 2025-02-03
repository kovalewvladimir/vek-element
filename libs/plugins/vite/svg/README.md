# @vek-element/svg

Vite плагин для работы с SVG

## Установка

```bash
npm install @vek-element/eslint-config --save-dev
```

## Использование

### 1. Vite конфигурация

Добавить в `vite.config.ts` плагин для работы с SVG

```typescript
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    Vue(),
    SvgIcons({
      iconDirs: [path.resolve(__dirname, './src/assets/svgs')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  }
})
```

### 2. main.ts

Нужно подключить svg иконки в `main.ts`

```typescript
import 'virtual:svg-icons-register'
```
