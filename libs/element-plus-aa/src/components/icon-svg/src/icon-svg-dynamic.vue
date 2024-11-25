<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { computed, defineAsyncComponent } from 'vue'

const {
  name,
  size = 32,
  color,
  hoverColor
} = defineProps<{
  /**
   * Имя иконки
   *
   * Для работы компонента необходимо:
   *  1. подключить vite плагин vite-svg-loader
   *     https://www.npmjs.com/package/vite-svg-loader
   *  2. иконки должны быть в папке /assets/svgs
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

const AsyncComponent = defineAsyncComponent({
  loader: async () => {
    try {
      return await import(`@/assets/svgs/${name}.svg?component`)
    } catch {
      console.error(`[ela-icon-svg-dynamic]: icon /assets/svgs/${name}.svg not found`)
    }
  }
})

defineEmits(['click'])
</script>

<template>
  <el-icon
    :class="{ 'icon-sgv': isHoverColor }"
    :color="color"
    :size="size"
    @click="$emit('click', $event)"
  >
    <component :is="AsyncComponent" />
  </el-icon>
</template>

<style scoped>
.icon-sgv:hover {
  color: v-bind(hoverColor);
}
</style>
