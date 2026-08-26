import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

import type { Options as ElementPlusOptions } from 'unplugin-element-plus'
import ElementPlus from 'unplugin-element-plus/vite'
import type { Plugin } from 'vite'

/**
 * Опции фабрики {@link VekElementPlus}.
 */
export interface VekElementPlusOptions {
  /**
   * Опции, которые пробрасываются в `unplugin-element-plus`.
   * Мержатся поверх дефолтов кита, поэтому можно донастроить что угодно.
   *
   * ВАЖНО: `include` переопределять не стоит — плагин не дополняет свой дефолт,
   * а заменяет его целиком, и подзапросы vite к script-блоку SFC перестанут
   * попадать под трансформацию.
   */
  elementPlus?: Partial<ElementPlusOptions>

  /**
   * Пре-бандлить стили element-plus в dev-режиме.
   *
   * Импорты стилей рождаются только при трансформации файла, статически они не видны,
   * поэтому vite обнаруживает их лишь при первом заходе на страницу → досборка
   * пре-бандла → полная перезагрузка вкладки. Объявленный заранее список это убирает.
   *
   * @default true
   */
  optimizeStyles?: boolean
}

const STYLES_PLUGIN_NAME = 'vek:element-plus-styles'

/**
 * Список пре-бандлимых стилей element-plus.
 *
 * Читается из element-plus, установленного В ПРОЕКТЕ (а не рядом с китом): при pnpm,
 * симлинках и монорепо папки `node_modules/element-plus` рядом с китом может не быть,
 * а версия element-plus, от которой зависит список, — проектная (у кита он в peer).
 *
 * Глоб в `optimizeDeps.include` не подходит: vite раскрывает его через `exports` пакета,
 * а у стилей компонентов element-plus нет `.d.ts` и шаблон схлопывается в пустоту.
 * Поэтому список строится обходом каталога.
 *
 * Идентификаторы — без расширения (`.../style/css`): ровно в таком виде импорт дописывает
 * `unplugin-element-plus`, вариант с `.mjs` дал бы другой ключ в кэше пре-бандла.
 */
const elementPlusStyles = (root: string): string[] => {
  try {
    // Резолв идёт через `element-plus/package.json` — это работает,
    // потому что у element-plus в `exports` есть `"./*": "./*"`.
    const require = createRequire(path.join(root, 'index.js'))
    const components = path.join(
      path.dirname(require.resolve('element-plus/package.json')),
      'es/components'
    )

    return fs
      .readdirSync(components, { withFileTypes: true })
      .filter(
        (e) => e.isDirectory() && fs.existsSync(path.join(components, e.name, 'style/css.mjs'))
      )
      .map((e) => `element-plus/es/components/${e.name}/style/css`)
  } catch (error) {
    // Любая ошибка здесь — это «конфиг vite не читается вообще», поэтому деградируем
    // до пустого списка: пре-бандлинг стилей просто не включится.
    const message = error instanceof Error ? error.message : String(error)
    console.warn(
      `[${STYLES_PLUGIN_NAME}] Не удалось прочитать стили element-plus из "${root}": ${message}. ` +
        'Пре-бандлинг стилей пропущен.'
    )
    return []
  }
}

/**
 * Плагины vite, нужные для работы компонентов `@vek-element/*` с element-plus.
 *
 * Возвращает два плагина:
 * 1. настроенный `unplugin-element-plus` — дописывает импорты стилей element-plus,
 *    в том числе внутри пакетов кита (они ставятся исходниками и стили сами не импортируют);
 * 2. пре-бандлинг стилей element-plus в dev-режиме — убирает перезагрузки вкладки
 *    вида `optimized dependencies changed. reloading`.
 *
 * @example
 * ```ts
 * import { VekElementPlus } from '@vek-element/ui/vite'
 *
 * export default defineConfig({
 *   plugins: [Vue(), ...VekElementPlus(), UnoCSS()]
 * })
 * ```
 */
export const VekElementPlus = (options: VekElementPlusOptions = {}): Plugin[] => {
  const plugins: Plugin[] = [
    ElementPlus({
      // Дефолтный exclude плагина закрывает node_modules целиком, а пакеты @vek-element/*
      // ставятся исходниками и стили element-plus сами не импортируют — их надо
      // трансформировать наравне с кодом приложения.
      //
      // Класс [/\\] по обе стороны от node_modules — так написан дефолт самого плагина:
      // без ведущего разделителя паттерн совпал бы и на пакете вроде my-node_modules-helper,
      // а на Windows-путях не совпал бы вовсе.
      //
      // Lookahead — по `@vek-element/`, а не по `@vek-element/ui`: компоненты живут
      // в `@vek-element/ui-components`.
      exclude: [
        /[/\\]node_modules[/\\](?!@vek-element[/\\])/,
        /[/\\]\.git[/\\]/,
        /[/\\]\.nuxt[/\\]/
      ],

      // `apply` тут не ставим: плагин нужен и в dev, и в build.
      ...options.elementPlus
    })
  ]

  if (options.optimizeStyles !== false) {
    plugins.push({
      name: STYLES_PLUGIN_NAME,

      // `optimizeDeps` в build не читается, а `apply` применяется до вызова хуков,
      // так что в build плагин просто не позовут.
      apply: 'serve',

      // Возвращаем частичный конфиг, а не мутируем пользовательский: vite сам сольёт его
      // с настройками проекта, и потребитель сможет дописать свои `optimizeDeps.include`.
      config: (config) => ({
        optimizeDeps: { include: elementPlusStyles(path.resolve(config.root ?? process.cwd())) }
      })
    })
  }

  return plugins
}
