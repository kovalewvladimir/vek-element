<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { computed } from 'vue'

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
  color?: string
  /**
   * Цвет иконки при наведении
   */
  hoverColor?: string
}>()

const isHoverColor = computed(() => hoverColor !== undefined)

const symbolId = computed<string>(() => `#icon-${name}`)

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
