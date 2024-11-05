import unocss from '@unocss/eslint-config/flat'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormattingConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/', '**/node_modules/']
  },

  {
    name: 'import-sort',
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error'
    }
  },

  {
    name: 'unocss',
    ...unocss,
    rules: {
      'unocss/enforce-class-compile': 'error'
    }
  },

  // Vue + TypeScript
  // https://github.com/vuejs/eslint-config-typescript
  ...pluginVue.configs['flat/recommended'],
  // Включите другие правила, которые вам нужны.
  {
    name: 'vue/custom-rules-enabling',
    rules: {
      'vue/no-undef-components': 'error'
    }
  },
  ...vueTsEslintConfig({
    extends: ['recommendedTypeChecked']
  }),
  // Отключите рекомендуемые правила, которые вам не нужны.
  {
    name: 'vue/custom-rules-disabling',
    rules: {
      'vue/singleline-html-element-content-newline': 'off',

      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  // Отключает все правила, которые не нужны или могут конфликтовать с Prettier .
  {
    name: 'skip-formatting-config',
    ...skipFormattingConfig
  }
]
