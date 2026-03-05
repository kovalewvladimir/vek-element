import fs from 'node:fs'
import path from 'node:path'

import { Linter } from 'eslint'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// eslint-disable-next-line no-restricted-imports
import config from '../src/index.js'

const testDir = path.join(process.cwd(), '__test-temp__')
const testFile = path.join(testDir, 'test.ts')
const tsconfigFile = path.join(testDir, 'tsconfig.json')

function lint(code, filename = testFile) {
  // Записываем код в файл для type-aware правил
  fs.writeFileSync(filename, code)
  const linter = new Linter({ configType: 'flat' })
  return linter.verify(code, config, { filename })
}

function hasRule(messages, ruleId) {
  return messages.some((m) => m.ruleId === ruleId)
}

describe('typescript rules', () => {
  beforeEach(() => {
    // Создаем временную директорию и файл для тестов
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    // Создаем tsconfig.json для type-aware правил
    const tsconfigContent = JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: 'ES2020',
          module: 'ESNext',
          lib: ['ES2020']
        },
        include: ['*.ts']
      },
      null,
      2
    )
    fs.writeFileSync(tsconfigFile, tsconfigContent)

    if (!fs.existsSync(testFile)) {
      fs.writeFileSync(testFile, '')
    }
  })

  afterEach(() => {
    // Очищаем временные файлы
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile)
    }
    if (fs.existsSync(tsconfigFile)) {
      fs.unlinkSync(tsconfigFile)
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir)
    }
  })

  describe('consistent-type-imports', () => {
    it('правило зарегистрировано в конфиге', () => {
      const ruleConfig = config.find((c) => c.rules?.['@typescript-eslint/consistent-type-imports'])
      expect(ruleConfig).toBeDefined()

      const rule = ruleConfig.rules['@typescript-eslint/consistent-type-imports']
      expect(rule[0]).toBe('error')
      expect(rule[1].fixStyle).toBe('inline-type-imports')
      expect(rule[1].prefer).toBe('type-imports')
      expect(rule[1].disallowTypeAnnotations).toBe(true)
    })

    it('нет ошибки при inline type import', () => {
      const code = `import { type Foo } from 'bar'\n`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/consistent-type-imports')).toBe(false)
    })

    it('нет ошибки при обычном импорте значений', () => {
      const code = `import { foo } from 'bar'\n`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/consistent-type-imports')).toBe(false)
    })
  })

  describe('no-floating-promises', () => {
    it('ошибка при floating promise', () => {
      const code = `async function foo() { return 1 }\nfoo()\n`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/no-floating-promises')).toBe(true)
    })

    it('нет ошибки при void', () => {
      const code = `async function foo() { return 1 }\nvoid foo()\n`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/no-floating-promises')).toBe(false)
    })

    it('нет ошибки при await', () => {
      const code = `async function bar() {\n  async function foo() { return 1 }\n  await foo()\n}\n`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/no-floating-promises')).toBe(false)
    })
  })
})
