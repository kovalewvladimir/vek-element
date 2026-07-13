<script setup lang="ts">
import { type Column } from './column'

const { columns, isHeader = false } = defineProps<{
  columns: Column[]
  /** Строка является заголовком (для неё рендерятся ручки изменения ширины) */
  isHeader?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent, column: Column): void
  (e: 'contextmenu', event: MouseEvent, column: Column): void
  (e: 'resizeStart', event: MouseEvent, column: Column): void
}>()
</script>

<template>
  <div
    v-for="(column, index) in columns"
    :key="column.prop"
    class="cell"
    :style="column.widthStyle"
    @click="emit('click', $event, column)"
    @contextmenu="emit('contextmenu', $event, column)"
  >
    <slot
      :column="column"
      :index="index"
    />

    <div
      v-if="isHeader && column.resizable"
      class="resize-handle"
      data-testid="virt-table-resize-handle"
      @mousedown.stop.prevent="emit('resizeStart', $event, column)"
      @click.stop
    />
  </div>
</template>
