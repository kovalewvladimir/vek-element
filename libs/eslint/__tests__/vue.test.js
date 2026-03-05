import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { Linter } from 'eslint'
import pluginVue from 'eslint-plugin-vue'
import { describe, expect, it } from 'vitest'

// eslint-disable-next-line no-restricted-imports
import { importConfig } from '../src/configs/import.js'
// eslint-disable-next-line no-restricted-imports
import { unicornConfig } from '../src/configs/unicorn.js'

// Собираем конфиг для тестов без type-checked правил,
// т.к. Linter API не поддерживает parserOptions.project
const config = [
  { files: ['**/*.{js,ts,mts,tsx,vue}'] },
  ...importConfig,
  ...unicornConfig,
  ...defineConfigWithVueTs(pluginVue.configs['flat/recommended'], vueTsConfigs.recommended),
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
          html: { component: 'always', normal: 'always', void: 'any' },
          math: 'always',
          svg: 'always'
        }
      ],
      'vue/no-constant-condition': 'warn',
      'vue/no-empty-pattern': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-template': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/define-props-declaration': 'error',
      'vue/define-emits-declaration': 'error'
    }
  },
  {
    name: 'vek/custom-rules-disabling',
    rules: {
      'vue/singleline-html-element-content-newline': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]

function lint(code, filename = 'test.vue') {
  const linter = new Linter({ configType: 'flat' })
  return linter.verify(code, config, { filename })
}

function hasRule(messages, ruleId) {
  return messages.some((m) => m.ruleId === ruleId)
}

describe('vue rules', () => {
  describe('vue/component-name-in-template-casing', () => {
    it('ошибка при PascalCase компоненте в шаблоне', () => {
      const code = `<script setup lang="ts">
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/component-name-in-template-casing')).toBe(true)
    })

    it('нет ошибки при kebab-case компоненте', () => {
      const code = `<script setup lang="ts">
import MyComponent from './MyComponent.vue'
</script>

<template>
  <my-component />
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/component-name-in-template-casing')).toBe(false)
    })
  })

  describe('vue/block-order', () => {
    it('ошибка при template перед script', () => {
      const code = `<template>
  <div>hello</div>
</template>

<script setup lang="ts">
const x = 1
</script>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/block-order')).toBe(true)
    })

    it('нет ошибки при правильном порядке (script, template, style)', () => {
      const code = `<script setup lang="ts">
const x = 1
</script>

<template>
  <div>hello</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/block-order')).toBe(false)
    })
  })

  describe('vue/define-props-declaration', () => {
    it('ошибка при runtime declaration пропсов', () => {
      const code = `<script setup lang="ts">
const props = defineProps({
  foo: String
})
</script>

<template>
  <div>{{ props.foo }}</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/define-props-declaration')).toBe(true)
    })

    it('нет ошибки при type-based declaration пропсов', () => {
      const code = `<script setup lang="ts">
const props = defineProps<{
  foo: string
}>()
</script>

<template>
  <div>{{ props.foo }}</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/define-props-declaration')).toBe(false)
    })
  })

  describe('vue/define-emits-declaration', () => {
    it('ошибка при runtime declaration emits', () => {
      const code = `<script setup lang="ts">
const emit = defineEmits(['change'])
</script>

<template>
  <div />
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/define-emits-declaration')).toBe(true)
    })
  })

  describe('vue/padding-line-between-blocks', () => {
    it('ошибка при отсутствии пустой строки между блоками', () => {
      const code = `<script setup lang="ts">
const x = 1
</script>
<template>
  <div>hello</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/padding-line-between-blocks')).toBe(true)
    })
  })

  describe('vue/no-unused-refs', () => {
    it('ошибка при неиспользованном ref в шаблоне', () => {
      const code = `<script setup lang="ts">
const x = 1
</script>

<template>
  <div ref="foo">hello</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/no-unused-refs')).toBe(true)
    })
  })

  describe('отключенные правила', () => {
    it('vue/singleline-html-element-content-newline отключено', () => {
      const code = `<script setup lang="ts">
const x = 1
</script>

<template>
  <span>inline content</span>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, 'vue/singleline-html-element-content-newline')).toBe(false)
    })

    it('@typescript-eslint/no-explicit-any отключено', () => {
      const code = `<script setup lang="ts">
const x: any = 1
</script>

<template>
  <div>{{ x }}</div>
</template>
`
      const messages = lint(code)
      expect(hasRule(messages, '@typescript-eslint/no-explicit-any')).toBe(false)
    })
  })
})
