<script setup lang="ts">
import { type Column } from './column'

const { columns } = defineProps<{ columns: Column[] }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent, column: Column): void
  (e: 'contextmenu', event: MouseEvent, column: Column): void
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
  </div>
</template>
