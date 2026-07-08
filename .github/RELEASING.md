# Выпуск пакетов в npm

Публикация автоматизирована через GitHub Action [`release.yml`](workflows/release.yml).
Триггер ручной: **Actions → Release → Run workflow**, где выбираешь пакет и тип бампа
(`patch` / `minor` / `major`).

Workflow сам: прогонит проверки (`lint`, `type-check`, тесты `eslint-config`), бампнет
версию, закоммитит бамп, поставит git-тег вида `@vek-element/ui@0.0.86`, запушит,
опубликует пакет в npm с provenance и создаст **GitHub Release** с авто-changelog.

## GitHub Release

После публикации создаётся запись на вкладке **Releases**:

- Заметки генерируются автоматически (`--generate-notes`) из коммитов/PR **с
  предыдущего тега того же пакета** — чтобы в монорепо не смешивались изменения разных
  библиотек. Предыдущий тег ищется по маске `@vek-element/ui@*` с version-сортировкой.
- К релизу прикладывается `.tgz`-тарболл — тот же артефакт, что уехал в npm.
- Прав хватает встроенного `GITHUB_TOKEN` (`contents: write`), отдельных секретов не нужно.

> Для аккуратного changelog именуй PR понятно — GitHub строит заметки из их заголовков.

## Одноразовая настройка (обязательно)

Аутентификация идёт через **OIDC Trusted Publishing** — без токенов в GitHub Secrets.
Но для этого каждый пакет нужно один раз связать с этим репозиторием на npmjs.com.

Для **каждого** из пакетов:

- `@vek-element/ui`
- `@vek-element/ui-components`
- `@vek-element/vite-svg`
- `@vek-element/eslint-config`

сделай следующее:

1. Открой `https://www.npmjs.com/package/<имя-пакета>/access`
   (или **Settings → Publishing access** на странице пакета).
2. В разделе **Trusted Publisher** выбери **GitHub Actions** и укажи:
   - **Organization or user:** `kovalewvladimir`
   - **Repository:** `vek-element`
   - **Workflow filename:** `release.yml`
   - **Environment:** оставь пустым (см. ниже про опциональный gate).
3. Сохрани.

> Пакет должен уже существовать в реестре (у всех текущих пакетов это так).
> Для самой первой публикации нового пакета Trusted Publishing настроить нельзя —
> первый `npm publish` придётся сделать вручную с токеном, дальше уже через OIDC.

Никаких `NPM_TOKEN` в GitHub Secrets заводить не нужно.

## Порядок при изменении связанных пакетов

`@vek-element/ui` в своём `prepack` подставляет **последнюю опубликованную** версию
`@vek-element/ui-components` из реестра. Поэтому если поменяли обе библиотеки —
сначала выпускай **ui-components**, потом **ui**.

## Опционально: ручное подтверждение перед публикацией

Если хочется gate «нажми, чтобы подтвердить публикацию»:

1. В репозитории: **Settings → Environments → New environment**, например `npm-publish`,
   добавь **Required reviewers**.
2. В [`release.yml`](workflows/release.yml) в job `release` добавь `environment: npm-publish`.
3. На npmjs.com в Trusted Publisher того же пакета укажи это же имя окружения.

## Что осталось ручным

Старые npm-скрипты (`version:*`, `publish:*` в корневом `package.json`) оставлены как
локальный фолбэк, но штатный путь выпуска — через Action.
