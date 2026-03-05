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

describe('unicorn rules', () => {
  describe('отключенные правила', () => {
    it('unicorn/no-null отключено', () => {
      const code = `const x = null\n`
      const messages = lint(code)
      expect(hasRule(messages, 'unicorn/no-null')).toBe(false)
    })

    it('unicorn/prevent-abbreviations отключено', () => {
      const code = `const btn = document.querySelector('button')\n`
      const messages = lint(code)
      expect(hasRule(messages, 'unicorn/prevent-abbreviations')).toBe(false)
    })

    it('unicorn/better-regex отключено', () => {
      const code = `const re = /[0-9]/\n`
      const messages = lint(code)
      expect(hasRule(messages, 'unicorn/better-regex')).toBe(false)
    })
  })

  describe('включенные правила (из all preset)', () => {
    it('unicorn/no-array-for-each срабатывает', () => {
      const code = `const arr = [1, 2, 3]\narr.forEach((x) => console.log(x))\n`
      const messages = lint(code)
      expect(hasRule(messages, 'unicorn/no-array-for-each')).toBe(true)
    })

    it('unicorn/prefer-number-properties срабатывает', () => {
      const code = `const x = parseInt('10', 10)\n`
      const messages = lint(code)
      expect(hasRule(messages, 'unicorn/prefer-number-properties')).toBe(true)
    })
  })
})
