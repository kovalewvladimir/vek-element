import { describe, expect, it } from 'vitest'

// eslint-disable-next-line no-restricted-imports
import config from '../src/index.js'

describe('eslint-config', () => {
  it('конфиг экспортируется как массив', () => {
    expect(Array.isArray(config)).toBe(true)
  })

  it('конфиг содержит элементы', () => {
    expect(config.length).toBeGreaterThan(0)
  })

  it('содержит конфиг files-to-lint', () => {
    const filesToLint = config.find((c) => c.name === 'vek/files-to-lint')
    expect(filesToLint).toBeDefined()
    expect(filesToLint.files).toContain('**/*.{js,ts,mts,tsx,vue}')
  })

  it('содержит конфиг files-to-ignore', () => {
    const filesToIgnore = config.find((c) => c.name === 'vek/files-to-ignore')
    expect(filesToIgnore).toBeDefined()
    expect(filesToIgnore.ignores).toBeDefined()
    expect(filesToIgnore.ignores.length).toBeGreaterThan(0)
  })

  it('содержит все именованные vek-конфиги', () => {
    const vekNames = config.filter((c) => c.name?.startsWith('vek/')).map((c) => c.name)

    expect(vekNames).toContain('vek/files-to-lint')
    expect(vekNames).toContain('vek/files-to-ignore')
    expect(vekNames).toContain('vek/import-sort')
    expect(vekNames).toContain('vek/custom-imports')
    expect(vekNames).toContain('vek/unocss')
    expect(vekNames).toContain('vek/unicorn')
    expect(vekNames).toContain('vek/typescript-custom-rules')
    expect(vekNames).toContain('vek/custom-rules-enabling')
    expect(vekNames).toContain('vek/custom-rules-disabling')
    expect(vekNames).toContain('vek/skip-formatting-config')
  })
})
