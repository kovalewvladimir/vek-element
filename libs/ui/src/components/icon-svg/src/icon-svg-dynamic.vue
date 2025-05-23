<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { computed, warn } from 'vue'

const {
  name,
  size = 32,
  color,
  hoverColor
} = defineProps<{
  /**
   * Имя иконки
   *
   * Для работы компонента необходимо подключить vite плагин @vek-element/vite-svg
   * https://www.npmjs.com/package/@vek-element/vite-svg
   */
  name: string
  /**
   * Размер иконки
   * @default 32
   */
  size?: number
  /**
   * Цвет иконки
   */
  color?: string // eslint-disable-line vue/require-default-prop
  /**
   * Цвет иконки при наведении
   */
  hoverColor?: string // eslint-disable-line vue/require-default-prop
}>()

const isHoverColor = computed(() => hoverColor !== undefined)

const symbolId = computed<string>(() => {
  const iconId = `#icon-${name}`
  try {
    if (!document.querySelector(iconId)) {
      warn(`Icon '${name}' not found`)
    }
  } catch {
    warn(`Icon '${name}' not supported. Please check the icon name`)
  }
  return iconId
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <el-icon
    :class="{ 'icon-sgv': isHoverColor }"
    :color="color"
    :size="size"
    @click="emit('click', $event)"
  >
    <svg aria-hidden="true">
      <use :href="symbolId" />
    </svg>
  </el-icon>
</template>

<style scoped>
.icon-sgv:hover {
  color: v-bind(hoverColor);
}
</style>
