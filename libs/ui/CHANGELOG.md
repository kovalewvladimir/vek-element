# Changelog

Изменения, которые ещё не выпущены, пишутся в секцию `## Unreleased`. Номер версии и дату проставляет релизный workflow (Actions → Release): он бампит версию, переименовывает `## Unreleased` в `## <версия> — <дата>` и подставляет текст секции в описание GitHub Release. Руками номера версий здесь не пишем.

## Unreleased

### Новое

- Подпуть **`@vek-element/ui/vite`** — build-time точка входа с фабрикой плагинов `VekElementPlus`.

  ```ts
  import { VekElementPlus } from '@vek-element/ui/vite'

  export default defineConfig({
    plugins: [Vue(), ...VekElementPlus(), UnoCSS()]
  })
  ```

  Фабрика возвращает два плагина:
  1. настроенный `unplugin-element-plus` — с `exclude`, который пропускает через трансформацию пакеты `@vek-element/*` (кит ставится исходниками и стили element-plus сам не импортирует, а дефолтный `exclude` плагина закрывает `node_modules` целиком);
  2. `vek:element-plus-styles` (`apply: 'serve'`) — объявляет `optimizeDeps.include` со списком стилей element-plus, чтобы vite не дособирал пре-бандл при заходе на страницу и не перезагружал вкладку (`optimized dependencies changed. reloading`).

  Список стилей читается обходом каталога `es/components` у element-plus, установленного **в проекте** (у кита он в `peerDependencies`). Если element-plus не найден, чтение конфига не падает: список пустой плюс предупреждение в консоль.

  Опции (обе необязательные): `elementPlus` — сквозная передача опций в `unplugin-element-plus` поверх дефолтов кита; `optimizeStyles` (по умолчанию `true`) — выключатель второго плагина.

### Изменения

- `unplugin-element-plus` переехал в `dependencies` кита — потребителю его больше не нужно ни ставить, ни настраивать в своём `vite.config.ts`.
- Из `vite.config.ts` потребителя убираются импорт `unplugin-element-plus/vite`, его ручная настройка и блок `optimizeDeps` со списком стилей element-plus.
- В `files` пакета добавлен `dist`: подпуть `./vite` поставляется скомпилированным JS (его грузит сам Node при чтении конфига vite, без сборщика). Остальные экспорты (`.`, `./layout`, `./utils`) по-прежнему отдаются исходниками.
