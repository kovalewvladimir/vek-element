# Описание

Демо-приложение библиотек `@vek-element/*`.

Опубликовано на GitHub Pages: <https://kovalewvladimir.github.io/vek-element/>

## Разделы меню

| Раздел | Что показывает |
| --- | --- |
| Components | Компоненты `@vek-element/ui-components` — по странице на компонент |
| Hooks | Хуки `@vek-element/ui/hooks` |
| Utils | Утилиты `@vek-element/ui/utils` |
| Layout | Поведение layout и роутера: параметризованные пути и кэш, прокрутка, вложенное меню, длинные заголовки, много пунктов |
| Playground | Песочница: `useLayoutConfigStore`, `useNavigationStore` |

Навигация описана в [src/navigation](src/navigation) — по файлу на раздел; страницы лежат в [src/views](src/views) в папках с теми же именами.

## Локальный запуск

```bash
npm run dev      # dev-сервер (http://localhost:8999)
npm run preview  # сборка + локальный просмотр production-бандла
```

## Сборка

```bash
npm run build:example                          # сборка в apps/example/dist (base = /)
BASE_PATH=/vek-element/ npm run build:example  # сборка для GitHub Pages
```

`BASE_PATH` попадает в vite `base` и дальше в `import.meta.env.BASE_URL`: от него зависят пути к ассетам, `public/imgs` и база history-режима vue-router. По умолчанию — `/`.

## Деплой

Workflow [.github/workflows/deploy-pages.yml](../../.github/workflows/deploy-pages.yml) собирает приложение и публикует его на GitHub Pages при push в `master` (или вручную: Actions → «Deploy example to GitHub Pages» → Run workflow).

Разовая настройка репозитория: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Особенности статического хостинга, которые уже учтены:

- `dist/404.html` — копия `index.html` (SPA-fallback: без него прямой заход на `/vek-element/dashboard` вернул бы страницу 404 GitHub Pages);
- `public/.nojekyll` — отключает обработку Jekyll.
