<script setup lang="ts">
import { computed } from 'vue'

import { type Column, type Columns } from './column'
import { COLUMN_AUTO_WIDTH } from './constants'

const { columns } = defineProps<{ columns: Columns }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent, column: Column): void
  (e: 'contextmenu', event: MouseEvent, column: Column): void
}>()

const computedColumns = computed<Column[]>(() => {
  // В TypeScript/JavaScript метод Array.filter() создает новый массив,
  // проходя по каждому элементу исходного массива.
  // При этом, если у вас определен тип Column как класс с конструктором,
  // то при попытке копирования элементов в новый массив может происходить
  // неявный вызов конструктора
  //
  // Поэтому нельзя использовать Array.filter() для фильтрации массива объектов
  // return columns.filter((v) => v.visible)

  const result = []
  for (const column of columns) {
    if (column.visible) {
      result.push(column)
    }
  }
  return result
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
