# Описание

E2E-тесты на Playwright для демо-приложения [apps/example](../example).

Конфигурация — [playwright.config.ts](playwright.config.ts). Дев-сервер поднимается автоматически
(`webServer`: `npm run dev` из корня репозитория, <http://localhost:8999>), запускать его руками не нужно.

## Структура

| Папка | Что проверяет |
| --- | --- |
| [tests/button-icon](tests/button-icon) | `VuButtonIcon` и подтверждение действия |
| [tests/virt-table](tests/virt-table) | `VuVirtTable`: фильтры, бесконечная прокрутка, ресайз колонок, строка ИТОГО, подсказки |
| [tests/virt-table-optimization](tests/virt-table-optimization) | Оптимизация перерисовок таблицы |
| [tests/virt-table-perf](tests/virt-table-perf) | CPU-профиль таблицы, ручной инструмент |

Общие хелперы — [tests/fixtures.ts](tests/fixtures.ts).

## Настройка среды

1. Зависимости ставятся из корня репозитория — это npm workspace:

   ```bash
   npm ci
   ```

2. Браузеры Playwright. Их версия жёстко привязана к версии `@playwright/test`, поэтому после
   каждого обновления пакета бинарники нужно докачать, иначе тесты падают с
   `Executable doesn't exist`:

   ```bash
   npx playwright install chromium   # тесты гоняются только в chromium
   npx playwright install-deps       # системные библиотеки, нужны один раз
   ```

   В dev-контейнере оба шага уже выполнены при сборке образа
   ([.devcontainer/Dockerfile](../../.devcontainer/Dockerfile)), но там ставится та версия,
   что была актуальна на момент сборки. После `git pull` с обновлённым `@playwright/test`
   выполните `npx playwright install chromium` в своём контейнере.

3. `xdg-utils` — нужен, только если пользуетесь trace viewer из расширения VS Code
   (см. ниже). В образ он не входит:

   ```bash
   apt-get update && apt-get install -y --no-install-recommends xdg-utils
   ```

## Запуск

```bash
npm run test -w vek-element-e2e         # все тесты
npm run test:ui -w vek-element-e2e      # UI-режим Playwright
npm run test:headed -w vek-element-e2e  # с видимым браузером
npm run test:report -w vek-element-e2e  # открыть последний отчёт
```

Тест `virt-table-perf` по умолчанию пропускается, это ручной инструмент:

```bash
PERF=1 npx playwright test virt-table-perf
```

## Trace viewer в VS Code

Расширение `ms-playwright.playwright`, галка «Show trace viewer» в панели тестов. Трейс
открывается в браузере хоста автоматически, но только при совпадении нескольких условий:

- запуск через **Run**, не через Debug — в режиме отладки вьювер не стартует вовсе;
- в панели Playwright выбран тот конфиг, чьи тесты вы запускаете;
- в контейнере установлен `xdg-utils` (см. «Настройка среды»). Начиная с Playwright 1.62
  используется системный `xdg-open`, а не вложенный в пакет; без него `open()` тихо падает
  с `spawn xdg-open ENOENT` и браузер просто не открывается;
- переменная `CLAUDECODE` (или `COPILOT_CLI`) не выставлена. С Playwright 1.62 при них
  срабатывает `isCodingAgent()` и trace viewer намеренно не открывает браузер — то есть
  из терминала кодинг-агента вьювер не появится, из панели тестов появится.

Если вьювер уже запущен, он живёт отдельным процессом между прогонами: после починки среды
снимите и снова поставьте галку либо перезагрузите окно VS Code.
