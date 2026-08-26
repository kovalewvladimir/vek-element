# @vek-element/ui

UI компоненты

# Установка

## NPM зависимости

```bash
npm install unocss --save-dev

# опционально
npm install @vek-element/eslint-config --save-dev
```

> `unplugin-element-plus` ставить не нужно — он входит в зависимости `@vek-element/ui` и подключается плагином `VekElementPlus` (см. ниже).

## Настройка

### 1. Vite конфигурация

Подключить `VekElementPlus` из подпути `@vek-element/ui/vite`. Плагин возвращает массив, поэтому его нужно распаковать через `...`.

При использовании SVG иконок дополнительно добавить плагин `@vek-element/vite-svg`.

```typescript
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { VekElementPlus } from '@vek-element/ui/vite'
import SvgIcons from '@vek-element/vite-svg'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    Vue(),
    ...VekElementPlus(),
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

`VekElementPlus` заменяет собой две настройки, которые раньше приходилось держать в проекте:

- **`unplugin-element-plus` с нестандартным `exclude`.** Кит поставляется исходниками и стили element-plus сам не импортирует, поэтому его нужно трансформировать наравне с кодом приложения — дефолтный `exclude` плагина закрывает `node_modules` целиком. Ставить `unplugin-element-plus` в проект и настраивать его вручную **больше не нужно**.
- **`optimizeDeps.include` со списком стилей element-plus.** Импорты стилей появляются только при трансформации файла, поэтому vite обнаруживает их лишь при заходе на страницу и перезагружает вкладку (`optimized dependencies changed. reloading`). Плагин объявляет список заранее, читая его из element-plus, установленного в проекте. Свой блок `optimizeDeps` в конфиге **больше не нужен** (а если он есть — списки сольются).

#### Опции

Обе необязательные:

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `elementPlus` | `Partial<Options>` | `{}` | Опции `unplugin-element-plus`; мержатся поверх дефолтов кита |
| `optimizeStyles` | `boolean` | `true` | Пре-бандлинг стилей element-plus в dev-режиме (в `build` плагин не активируется) |

```typescript
...VekElementPlus({
  elementPlus: { defaultLocale: 'ru' },
  optimizeStyles: false
})
```

`include` у `unplugin-element-plus` лучше не переопределять: плагин не дополняет свой дефолт, а заменяет его целиком, и подзапросы vite к script-блоку SFC перестанут попадать под трансформацию.

Если element-plus в проекте не найден, чтение конфига не падает: список стилей остаётся пустым, в консоль выводится предупреждение.

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
