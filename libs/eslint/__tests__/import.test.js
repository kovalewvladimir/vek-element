import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'

// eslint-disable-next-line no-restricted-imports
import config from '../src/index.js'

function lint(code, filename = 'test.js') {
  const linter = new Linter({ configType: 'flat' })
  return linter.verify(code, config, { filename })
}

function hasRule(messages, ruleId) {
  return messages.some((m) => m.ruleId === ruleId)
}

describe('import rules', () => {
  describe('simple-import-sort/imports', () => {
    it('ошибка при неотсортированных импортах', () => {
      const code = `import b from 'b'\nimport a from 'a'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'simple-import-sort/imports')).toBe(true)
    })

    it('нет ошибки при отсортированных импортах', () => {
      const code = `import a from 'a'\nimport b from 'b'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'simple-import-sort/imports')).toBe(false)
    })
  })

  describe('simple-import-sort/exports', () => {
    it('ошибка при неотсортированных экспортах', () => {
      const code = `export { b } from 'b'\nexport { a } from 'a'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'simple-import-sort/exports')).toBe(true)
    })

    it('нет ошибки при отсортированных экспортах', () => {
      const code = `export { a } from 'a'\nexport { b } from 'b'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'simple-import-sort/exports')).toBe(false)
    })
  })

  describe('import/first', () => {
    it('ошибка когда импорт не первый', () => {
      const code = `const x = 1\nimport a from 'a'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'import/first')).toBe(true)
    })
  })

  describe('import/newline-after-import', () => {
    it('ошибка при отсутствии пустой строки после импортов', () => {
      const code = `import a from 'a'\nconst x = 1\n`
      const messages = lint(code)
      expect(hasRule(messages, 'import/newline-after-import')).toBe(true)
    })

    it('нет ошибки при пустой строке после импортов', () => {
      const code = `import a from 'a'\n\nconst x = 1\n`
      const messages = lint(code)
      expect(hasRule(messages, 'import/newline-after-import')).toBe(false)
    })
  })

  describe('no-restricted-imports', () => {
    it('ошибка при импорте из родительской директории', () => {
      const code = `import foo from '../foo'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'no-restricted-imports')).toBe(true)
    })

    it('нет ошибки при импорте из текущей директории', () => {
      const code = `import foo from './foo'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'no-restricted-imports')).toBe(false)
    })

    it('нет ошибки при импорте из пакета', () => {
      const code = `import vue from 'vue'\n`
      const messages = lint(code)
      expect(hasRule(messages, 'no-restricted-imports')).toBe(false)
    })
  })
})
