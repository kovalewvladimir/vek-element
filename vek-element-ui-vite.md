# ТЗ: подпуть `@vek-element/ui/vite` — build-time плагин для element-plus

> Задача для репозитория кита `@vek-element/ui`, не для `expenses-production`.
> Проверенные цифры и грабли ниже получены на потребителе: vite 8.1.5, node 24,
> element-plus 2.14.3, unplugin-element-plus 0.11.2.

## Контекст и мотивация

Кит поставляется **исходниками** (`exports` указывают на `./src/**/*.ts`), поэтому каждый
проект-потребитель обязан сам настраивать в своём `vite.config.ts` две вещи, которые на самом
деле являются знанием кита:

1. **`unplugin-element-plus` с нестандартным `exclude`.** Плагин дописывает
   `import 'element-plus/es/components/<имя>/style/css'` туда, где используется компонент
   element-plus. По умолчанию он не трогает `node_modules` — а значит, не трогает и кит, который
   ставится исходниками и **сам стили element-plus не импортирует** (на весь кит есть один явный
   импорт: `element-plus/es/components/message/style/css` в
   `ui-components/src/components/notification/src/notification.ts`). Без исключения из исключения
   компоненты кита (меню, кнопки, таблица) рендерятся без стилей.

2. **`optimizeDeps.include` со списком всех стилей element-plus.** Импорты стилей рождаются только
   при трансформации файла, статически они не видны, поэтому vite обнаруживает их лишь при первом
   заходе на страницу → досборка пре-бандла → полная перезагрузка вкладки
   (`dependencies optimized … reloading`). Объявленный заранее список убирает эти перезагрузки:
   они происходят один раз при старте.

Обе настройки уже отлажены и замерены в проекте-потребителе. Задача — перенести их в кит, чтобы
потребитель подключал один плагин.

## Что сделать

Добавить в пакет `@vek-element/ui` новый подпуть `./vite` — **build-time** точку входа,
экспортирующую фабрику плагинов для vite. Существующие экспорты (`.`, `./layout`, `./utils`)
не трогать.

## Жёсткие требования

1. **`./vite` компилируется в JS (`dist`), а не отдаётся исходником на TypeScript.** Причина:
   `vite.config.ts` исполняет Node на этапе чтения конфига, а bare-импорты из конфига vite помечает
   как external (плагин `externalize-deps` в его загрузчике конфига) — то есть файл грузит сам Node,
   без сборщика. `.ts` из `node_modules` при этом поедет только на type-stripping Node 24 и только
   при «стираемом» TS — на это закладываться нельзя. Эталон устройства такого пакета в этой же
   экосистеме — `@vek-element/vite-svg`: `"type": "module"`, `exports.import → ./dist/index.js`,
   `exports.types → ./src/index.ts`. Собирать тем же тулингом, что и он.
2. **Никаких рантайм-импортов в этой точке входа.** Ни `vue`, ни `.vue`, ни рантайма element-plus,
   ни `src/index.ts` кита. Только `node:fs`, `node:path`, `node:module`,
   `unplugin-element-plus/vite` и **type-only** импорт из `vite`.
3. **Точка входа не должна падать при чтении конфига.** Любая ошибка внутри — это «конфиг не
   читается вообще». Все обращения к файловой системе и резолву — под `try/catch` с деградацией до
   пустого списка и предупреждением.

## API

```ts
import { VekElementPlus } from '@vek-element/ui/vite'

export default defineConfig({
  plugins: [Vue(), ...VekElementPlus(), UnoCSS()]
})
```

Фабрика возвращает `Plugin[]` из двух плагинов: настроенный `unplugin-element-plus` и собственный
плагин пре-бандлинга стилей.

Опции (все необязательные, с разумными дефолтами):

- `elementPlus?: Options` — сквозная передача опций в `unplugin-element-plus` (мержится поверх наших
  дефолтов, чтобы потребитель мог что-то донастроить);
- `optimizeStyles?: boolean` (по умолчанию `true`) — выключатель второго плагина.

## Эталонная реализация

```ts
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

import ElementPlus from 'unplugin-element-plus/vite'
import type { Plugin } from 'vite'

// Список пре-бандлимых стилей читается из element-plus, установленного В ПРОЕКТЕ.
const elementPlusStyles = (root: string): string[] => {
  try {
    const require = createRequire(path.join(root, 'index.js'))
    const components = path.join(path.dirname(require.resolve('element-plus/package.json')), 'es/components')
    return fs
      .readdirSync(components, { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(components, e.name, 'style/css.mjs')))
      .map((e) => `element-plus/es/components/${e.name}/style/css`)
  } catch {
    return []
  }
}

export const VekElementPlus = (options: VekElementPlusOptions = {}): Plugin[] => {
  const plugins: Plugin[] = [
    ElementPlus({
      // Дефолтный exclude плагина закрывает node_modules целиком, а пакеты @vek-element/*
      // ставятся исходниками и стили element-plus сами не импортируют — их надо
      // трансформировать наравне с кодом приложения.
      exclude: [/[/\\]node_modules[/\\](?!@vek-element[/\\])/, /[/\\]\.git[/\\]/, /[/\\]\.nuxt[/\\]/],
      ...options.elementPlus
    })
  ]

  if (options.optimizeStyles !== false) {
    plugins.push({
      name: 'vek:element-plus-styles',
      apply: 'serve',
      config: (config) => ({ optimizeDeps: { include: elementPlusStyles(config.root ?? process.cwd()) } })
    })
  }

  return plugins
}
```

## Грабли — проверить каждую

1. **Резолвить element-plus от корня ПРОЕКТА, а не от папки кита.**
   `path.resolve(__dirname, 'node_modules/element-plus')` внутри пакета неверен: при pnpm, симлинках
   и монорепо этой папки рядом с китом может не быть, а версия element-plus, важная для списка, —
   проектная (у кита он в peer). Отсюда `createRequire(<config.root>)`. Резолв идёт через
   `element-plus/package.json` — это работает, потому что у element-plus в `exports` есть
   `"./*": "./*"`.
2. **Глоб в `optimizeDeps.include` не подойдёт — только чтение каталога.** Vite раскрывает глобы в
   `include` через `exports` пакета, опираясь на файлы, попадающие под экспортируемый шаблон;
   у `element-plus/es/components/*/style/css` нет `.d.ts`, и шаблон схлопывается в пустоту
   (проверено на vite 8.1.5). Поэтому список строится обходом каталога. Сейчас это 118 записей.
3. **Идентификатор в списке — без расширения:** `element-plus/es/components/button/style/css`. Ровно
   в таком виде импорт дописывает `unplugin-element-plus`; вариант с `.mjs` даст другой ключ в кэше
   пре-бандла, и досборка с перезагрузкой вернётся.
4. **`config()` возвращает частичный конфиг, а не мутирует пользовательский** — vite сам сольёт его
   с настройками проекта, и потребитель сможет дописать свои `optimizeDeps.include`.
5. **`apply: 'serve'`** — `optimizeDeps` в build не читается. `apply` применяется до вызова хуков,
   так что в `build` плагин просто не позовут. У `unplugin-element-plus` `apply` не ставить: он нужен
   в обоих режимах.
6. **`include` у `unplugin-element-plus` не переопределять.** Он не дополняет дефолт, а заменяет его
   целиком; дефолт — `['**/*.vue', '**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx',
   '**/*.vue?vue&type=script*', /\.vue\.[tj]sx?\?vue/]`, где последние два элемента отвечают за
   подзапросы vite к script-блоку SFC (под glob `**/*.vue` они не подходят из-за query).
7. **`exclude` пишется с классом `[/\\]` по обе стороны от `node_modules`** — так написан дефолт
   самого плагина. Паттерн без ведущего разделителя совпадёт и на пакете вроде
   `my-node_modules-helper`, а на Windows-путях не совпадёт вовсе, и плагин полезет трансформировать
   все зависимости.
8. **Lookahead — по `@vek-element/`, а не по `@vek-element/ui`.** Компоненты живут в
   `@vek-element/ui-components`; узкий вариант пропускал его лишь по совпадению префикса имени.

## Изменения в `package.json` кита

- новый экспорт:
  ```json
  "./vite": { "types": "./dist/vite/index.d.ts", "import": "./dist/vite/index.js" }
  ```
  (пути — по факту принятой в пакете схемы сборки);
- `unplugin-element-plus` (`0.11.2` или новее) переезжает в **`dependencies`** кита: потребитель его
  больше не ставит;
- `vite` — только в `devDependencies` кита; в коде он импортируется как `import type`, при сборке
  импорт стирается;
- `element-plus` остаётся в `peerDependencies` (уже `^2.14.0`);
- версия: минорный бамп (`0.1.4` → `0.2.0`), запись в CHANGELOG, раздел в README с примером
  подключения и с явной пометкой, что потребителю больше не нужны ни `unplugin-element-plus`,
  ни `optimizeDeps.include` в своём конфиге.

## Критерии приёмки

1. `node -e "import('@vek-element/ui/vite').then((m) => console.log(Object.keys(m)))"`, запущенный из
   корня проекта-потребителя, печатает экспорт — значит точка входа грузится чистым Node без
   сборщика (см. требование 1).
2. В проекте-потребителе конфиг сводится к `plugins: [Vue(), ...VekElementPlus(), …]`, из него
   исчезают `fs`, локальная функция списка стилей, блок `optimizeDeps` и импорт
   `unplugin-element-plus/vite`.
3. Холодный кэш (`rm -rf node_modules/.vite`), `npm run dev`, обход страниц приложения: в логе vite
   **ни одной** строки `optimized dependencies changed. reloading`.
4. Состав и порядок `<style>`-тегов в `head` идентичны текущему поведению. Опорные цифры
   проекта-потребителя: на реестре — 57 тегов, из них 39 `element-plus/theme-chalk/*` и 13 стилей
   компонентов кита; на карточке — 71 и 50 соответственно. Контрольная переменная
   `--el-border-radius-base` в браузере = `3px` (перекрытие проекта выигрывает у `base.css`
   element-plus — значит порядок не поехал).
5. Компоненты кита отрисованы со стилями (меню, кнопки, виртуальная таблица) — это прямая проверка
   пункта 8 из «граблей».
6. `npm run build` в потребителе проходит, размер бандла не меняется; плагин стилей в build не
   активируется.
7. Если element-plus в проекте не найден, чтение конфига не падает: пустой список плюс
   предупреждение в консоль.
