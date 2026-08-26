#!/usr/bin/env node

/**
 * Закрывает секцию `## Unreleased` в CHANGELOG.md пакета номером версии и датой.
 *
 * Версию пакетам присваивает релизный workflow (`npm version` на раннере), поэтому
 * в репозитории changelog ведётся без номеров: всё, что накопилось, пишется в
 * `## Unreleased`, а этот скрипт — уже зная версию — превращает заголовок в
 * `## 0.2.0 — 2026-08-26` и отдаёт тело секции для описания GitHub Release.
 *
 * Использование:
 *   node scripts/release-changelog.ts <путь-к-CHANGELOG.md> <версия> [файл-для-нот]
 *
 * Закрытая секция остаётся в файле, а пустая `## Unreleased` возвращается на место —
 * следующим изменениям сразу есть куда ложиться.
 *
 * Ничего не найдено (нет файла, нет секции `## Unreleased` или она пустая) — это не
 * ошибка: скрипт пишет предупреждение и выходит с кодом 0, чтобы не ронять релиз,
 * который changelog не затрагивает. Файл с нотами в этом случае не создаётся — по его
 * наличию workflow и решает, откуда брать описание релиза.
 */

import fs from 'node:fs'
import path from 'node:path'

if (process.argv.length < 4) {
  throw new Error('Usage: node release-changelog.ts <changelog-path> <version> [notes-out-path]')
}

const [changelogArg, version, notesOutArg] = process.argv.slice(2)

const changelogPath = path.resolve(changelogArg)

if (!fs.existsSync(changelogPath)) {
  console.warn(`CHANGELOG не найден: ${changelogPath} — пропускаем`)
  process.exit(0)
}

const changelog = fs.readFileSync(changelogPath, 'utf8')

// Секция = заголовок `## Unreleased` и всё до следующего заголовка того же уровня.
const section = /^## +Unreleased *$\n(?<body>[\S\s]*?)(?=^## |(?![\S\s]))/m.exec(changelog)

if (!section) {
  console.warn(`В ${changelogPath} нет секции "## Unreleased" — пропускаем`)
  process.exit(0)
}

const body = (section.groups?.body ?? '').trim()

if (body.length === 0) {
  console.warn(`Секция "## Unreleased" в ${changelogPath} пустая — пропускаем`)
  process.exit(0)
}

// Дата релиза в UTC: раннер всегда в UTC, локально — чтобы не зависеть от часового пояса.
const date = new Date().toISOString().slice(0, 10)

// Пустую `## Unreleased` возвращаем на место — чтобы следующие изменения было
// куда писать и никто не заводил секцию заново руками.
fs.writeFileSync(
  changelogPath,
  changelog.replace(/^## +Unreleased *$/m, `## Unreleased\n\n## ${version} — ${date}`)
)
console.log(`${changelogPath}: "## Unreleased" → "## ${version} — ${date}"`)

if (notesOutArg) {
  const notesOutPath = path.resolve(notesOutArg)
  fs.writeFileSync(notesOutPath, `${body}\n`)
  console.log(`Ноты релиза сохранены: ${notesOutPath}`)
}
