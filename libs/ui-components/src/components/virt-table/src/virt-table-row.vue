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

// Шаблон намеренно разделён на две ветки по isHeader.
//
// Обработчики @click/@contextmenu нужны только заголовку (сортировка и меню колонок), и
// компилятор не может их закэшировать из-за замыкания на column. Общая ветка вешала их и на
// ячейки тела с футером, где они эмитят в никуда: родитель подключает <virt-table-row> без
// этих слушателей, а клик по строке работает через всплытие на div.row. При 50 строках × 20
// колонках это ~2000 замыканий на рендер окна и столько же addEventListener при монтировании.
//
// После разделения ячейка тела компилируется с patch-флагом 4 /* STYLE */ вместо
// 44 /* STYLE, PROPS, NEED_HYDRATION */ и не аллоцирует замыканий.
//
// Просто удалить обработчики нельзя: корень компонента — фрагмент из v-for, fallthrough
// нативного onClick с <virt-table-row> на ячейки не работает, сортировка и меню отвалятся.
</script>

<template>
  <template v-if="isHeader">
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
        v-if="column.resizable"
        class="resize-handle"
        data-testid="virt-table-resize-handle"
        @mousedown.stop.prevent="emit('resizeStart', $event, column)"
        @click.stop
      />
    </div>
  </template>

  <template v-else>
    <div
      v-for="(column, index) in columns"
      :key="column.prop"
      class="cell"
      :style="column.widthStyle"
    >
      <slot
        :column="column"
        :index="index"
      />
    </div>
  </template>
</template>
