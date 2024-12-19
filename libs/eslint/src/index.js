import { importConfig } from './configs/import.js'
import { prettierConfig } from './configs/prettier.js'
import { typescriptConfig } from './configs/typescript.js'
import { unicornConfig } from './configs/unicorn.js'
import { unocssConfig } from './configs/unocss.js'
import { vueConfig } from './configs/vue.js'
import { GLOB_EXCLUDE } from './globs.js'

export default [
  {
    name: 'vek/files-to-lint',
    files: ['**/*.{js,ts,mts,tsx,vue}']
  },

  {
    name: 'vek/files-to-ignore',
    ignores: GLOB_EXCLUDE
  },

  ...importConfig,

  ...unocssConfig,

  ...unicornConfig,

  ...typescriptConfig,
  ...vueConfig,

  ...prettierConfig
]
