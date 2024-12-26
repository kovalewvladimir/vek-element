# @vek-element/ui

UI компоненты

# Установка

## NPM зависимости

```bash
npm install @vek-element/ui --save
npm install @vek-element/vite-svg --save

npm install unocss --save-dev
npm install unplugin-element-plus --save-dev

# опционально
npm install @vek-element/eslint-config --save-dev
```

## Настройка

### 1. Vite конфигурация

Добавить в `vite.config.ts` плагин для работы с SVG

При использовании SVG иконок, необходимо добавить плагин `vite-svg` в конфигурацию Vite.

```typescript
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
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
```

### 2. app.vue

```vue
<script setup lang="ts">
import { VuRootLayout } from '@vek-element/ui'
</script>

<template>
  <vu-root-layout />
</template>
```

### 3. main.ts

Нужно подключить стили и svg иконки

```typescript
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
```

Далее нужно создать:

1. Навигацию
2. Авторизацию
3. Layout
4. Используя `createUI` из `@vek-element/ui` создать UI инициализировать приложение

Пример можно посмотреть [здесь](https://github.com/kovalewvladimir/vek-element/tree/master/apps/example)
