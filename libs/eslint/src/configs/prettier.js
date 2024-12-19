import skipFormattingConfig from 'eslint-config-prettier'

export const prettierConfig = [
  // Отключает все правила, которые не нужны или могут конфликтовать с Prettier .
  {
    name: 'vek/skip-formatting-config',
    ...skipFormattingConfig
  }
]
