<script setup lang="ts">
import { ElIcon } from 'element-plus'

const {
  size = 32,
  color,
  hoverColor
} = defineProps<{
  size?: number
  color?: string
  hoverColor?: string
}>()

defineEmits(['click'])
</script>

<template>
  <!-- eslint-disable unocss/enforce-class-compile-->
  <ElIcon
    class="icon-sgv"
    :color="color"
    :size="size"
    @click="$emit('click')"
  >
    <!-- eslint-enable unocss/enforce-class-compile-->
    <slot />
  </ElIcon>
</template>

<style scoped>
.icon-sgv:hover {
  color: v-bind(hoverColor);
}
</style>
