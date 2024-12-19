import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export const vueConfig = [
  // Vue + TypeScript
  // https://github.com/vuejs/eslint-config-typescript
  ...pluginVue.configs['flat/recommended'],

  // Включите другие правила, которые вам нужны.
  {
    name: 'vek/custom-rules-enabling',
    rules: {
      'vue/no-undef-components': 'error'
    }
  },

  ...vueTsEslintConfig({
    extends: ['recommendedTypeChecked']
  }),

  // Отключите рекомендуемые правила, которые вам не нужны.
  {
    name: 'vek/custom-rules-disabling',
    rules: {
      'vue/singleline-html-element-content-newline': 'off',

      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
