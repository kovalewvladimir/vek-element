<script setup lang="ts">
import { computed } from 'vue'

import { COLUMN_AUTO_WIDTH } from './constants'
import { type Column, Columns } from './types'

const { columns } = defineProps({
  columns: {
    type: Columns,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent, column: Column): void
  (e: 'contextmenu', event: MouseEvent, column: Column): void
}>()

const computedColumns = computed(() => {
  return columns.filter((v) => v.visible)
})
</script>

<template>
  <div
    v-for="column in computedColumns"
    :key="column.prop"
    class="cell"
    :style="column.width !== COLUMN_AUTO_WIDTH ? `flex: 0 0 auto; width: ${column.width}px` : ''"
    @click="emit('click', $event, column)"
    @contextmenu="emit('contextmenu', $event, column)"
  >
    <slot :column="column" />
  </div>
</template>
