export const typescriptConfig = [
  {
    name: 'vek/typescript-custom-rules',
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports'
        }
      ]
    }
  }
]
