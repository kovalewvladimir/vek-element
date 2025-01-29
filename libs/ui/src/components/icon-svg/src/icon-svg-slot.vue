<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { computed } from 'vue'

const {
  size = 32,
  color,
  hoverColor
} = defineProps<{
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

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <el-icon
    :class="{ 'icon-sgv': isHoverColor }"
    :color="color"
    :size="size"
    @click="emit('click', $event)"
  >
    <slot />
  </el-icon>
</template>

<style scoped>
.icon-sgv:hover {
  color: v-bind(hoverColor);
}
</style>
