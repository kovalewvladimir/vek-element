import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export const unicornConfig = [
  eslintPluginUnicorn.configs['flat/all'],
  {
    name: 'vek/unicorn',
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/better-regex': 'off'
    }
  }
]
