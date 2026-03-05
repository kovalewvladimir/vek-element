import { describe, expect, it } from 'vitest'

// eslint-disable-next-line no-restricted-imports
import config from '../src/index.js'

const ignoresConfig = config.find((c) => c.name === 'vek/files-to-ignore')
const filesConfig = config.find((c) => c.name === 'vek/files-to-lint')

const ignores = ignoresConfig?.ignores ?? []
const files = filesConfig?.files ?? []

describe('globs', () => {
  it('конфиг содержит секцию vek/files-to-ignore', () => {
    expect(ignoresConfig).toBeDefined()
  })

  it('конфиг содержит секцию vek/files-to-lint', () => {
    expect(filesConfig).toBeDefined()
  })

  it('ignores содержит node_modules и dist', () => {
    expect(ignores).toContain('**/node_modules')
    expect(ignores).toContain('**/dist')
  })

  it('ignores содержит lockfile-ы', () => {
    expect(ignores).toContain('**/package-lock.json')
    expect(ignores).toContain('**/yarn.lock')
    expect(ignores).toContain('**/pnpm-lock.yaml')
    expect(ignores).toContain('**/bun.lockb')
  })

  it('ignores содержит директории сборки и кэша', () => {
    expect(ignores).toContain('**/output')
    expect(ignores).toContain('**/coverage')
    expect(ignores).toContain('**/.nuxt')
    expect(ignores).toContain('**/.vitepress/cache')
    expect(ignores).toContain('**/.vercel')
  })

  it('ignores содержит auto-generated файлы', () => {
    expect(ignores).toContain('**/auto-import?(s).d.ts')
    expect(ignores).toContain('**/components.d.ts')
  })

  it('files содержит js/ts/vue расширения', () => {
    expect(files.some((f) => f.includes('vue'))).toBe(true)
    expect(files.some((f) => f.includes('ts'))).toBe(true)
    expect(files.some((f) => f.includes('js'))).toBe(true)
  })
})
