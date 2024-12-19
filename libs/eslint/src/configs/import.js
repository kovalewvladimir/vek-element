import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export const importConfig = [
  {
    name: 'vek/import-sort',
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
  }
]
