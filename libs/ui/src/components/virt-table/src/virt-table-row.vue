<script setup lang="ts">
import { type Column } from './column'
import { COLUMN_AUTO_WIDTH } from './constants'

const { columns } = defineProps<{ columns: Column[] }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent, column: Column): void
  (e: 'contextmenu', event: MouseEvent, column: Column): void
}>()
</script>

<template>
  <div
    v-for="column in columns"
    :key="column.prop"
    class="cell"
    :style="column.width !== COLUMN_AUTO_WIDTH ? `flex: 0 0 auto; width: ${column.width}px` : ''"
    @click="emit('click', $event, column)"
    @contextmenu="emit('contextmenu', $event, column)"
  >
    <slot :column="column" />
  </div>
</template>
