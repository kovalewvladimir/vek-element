import vueTsEslintConfig from '@vue/eslint-config-typescript'
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
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
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

  // Vue + TypeScript
  // https://github.com/vuejs/eslint-config-typescript
  ...pluginVue.configs['flat/essential'],
  // Включите другие правила, которые вам нужны.
  {
    rules: {}
  },
  ...vueTsEslintConfig({ extends: ['recommendedTypeChecked'] }),
  // Отключите рекомендуемые правила, которые вам не нужны.
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
