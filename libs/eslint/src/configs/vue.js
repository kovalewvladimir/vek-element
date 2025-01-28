import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export const vueConfig = [
  // Vue + TypeScript
  // https://github.com/vuejs/eslint-config-typescript
  ...defineConfigWithVueTs(
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommendedTypeChecked
  ),

  // Включите другие правила, которые вам нужны.
  {
    name: 'vek/custom-rules-enabling',
    rules: {
      'vue/no-undef-components': 'error',

      'vue/component-name-in-template-casing': ['error', 'kebab-case'],

      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/eqeqeq': ['error', 'smart'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            component: 'always',
            normal: 'always',
            void: 'any'
          },
          math: 'always',
          svg: 'always'
        }
      ],

      'vue/no-constant-condition': 'warn',
      'vue/no-empty-pattern': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',

      'vue/object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
          ignoreConstructors: false
        }
      ],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-template': 'error',

      'vue/prefer-use-template-ref': 'error'
    }
  },

  // Отключите рекомендуемые правила, которые вам не нужны.
  {
    name: 'vek/custom-rules-disabling',
    rules: {
      'vue/singleline-html-element-content-newline': 'off',

      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
