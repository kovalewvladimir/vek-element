<script setup lang="ts">
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator
} from '@imengyu/vue3-context-menu'
import { ElInputNumber } from 'element-plus'
import { computed, type Ref, ref } from 'vue'

import { type Column, type Columns } from './column'
import { COLUMN_AUTO_WIDTH, COLUMN_MIN_WIDTH, FILTER_TYPE_LABEL } from './constants'
import DateFilter from './filter-date.vue'
import NumberFilter from './filter-number.vue'
import StringFilter from './filter-string.vue'
import {
  SvgAutoFitWindow,
  SvgClose,
  SvgColumn,
  SvgColumnEdit,
  SvgColumnOptions,
  SvgFilterClear,
  SvgFilterSettings,
  SvgFitWidth,
  SvgHide,
  SvgSortDown,
  SvgSortUp,
  SvgView
} from './svgs'
import { type FilterLogicalOperator, type FilterType, type SortType } from './types'

const { columns } = defineProps<{ columns: Columns }>()

const emit = defineEmits<{ (e: 'changeSort'): void; (e: 'changeFilter'): void }>()

// ==================
// Мутации Props!!!!
// ==================
const setColumnWidth = (width: number): void => {
  columnCurrent.value?.setWidth(width)
}
const setColumnVisible = (column: Column, visible: boolean): void => {
  column.setVisibility(visible)
}
const visibleAll = () => {
  columns.visibleAll()
}
const setSort = (sort: SortType) => {
  if (columnCurrent.value) {
    columns.setSort(columnCurrent.value, sort)
    emit('changeSort')
  }
}

const changeFilterOperator = (column: Column, filterOperator: FilterLogicalOperator) => {
  column.setOperator(filterOperator)
  emit('changeFilter')
}
const createFilter = (filter: FilterType, closeMenu: boolean) => {
  columnCurrent.value?.addFilter(filter)
  contextMenuVisible.value = !closeMenu
  emit('changeFilter')
}
const resetFilter = () => {
  columns.resetFilters()
  contextMenuVisible.value = false
  emit('changeFilter')
}
const deleteFilter = (column: Column, filter: FilterType) => {
  column.deleteFilter(filter)
  emit('changeFilter')
}
// ==================

const contextMenuVisible = ref(false)
const contextMenuOptions = ref({ theme: 'virt-table', zIndex: 999, x: 0, y: 0 })

const columnCurrent: Ref<Column | null> = ref(null)
const isColumnAutoWidth: Ref<boolean> = ref(false)

const columnWidth = computed({
  set(value: number) {
    if (isColumnAutoWidth.value || value === null) return

    setColumnWidth(value)
  },
  get() {
    return columnCurrent.value?.width || 0
  }
})

const onVisibleAll = () => {
  visibleAll()
}
const onHideCurrent = () => {
  if (columnCurrent.value) setColumnVisible(columnCurrent.value, false)
}

const onAutoWidth = () => {
  isColumnAutoWidth.value = !isColumnAutoWidth.value
  setColumnWidth(isColumnAutoWidth.value ? COLUMN_AUTO_WIDTH : COLUMN_MIN_WIDTH)
}

const onShowContextMenu = (e: MouseEvent, column: Column) => {
  e.preventDefault()
  contextMenuVisible.value = true
  contextMenuOptions.value.x = e.x
  contextMenuOptions.value.y = e.y

  columnCurrent.value = column
  isColumnAutoWidth.value = column.width === COLUMN_AUTO_WIDTH
}

defineExpose({ onShowContextMenu })
</script>

<template>
  <context-menu
    v-model:show="contextMenuVisible"
    :options="contextMenuOptions"
  >
    <context-menu-item
      label="Сортировать"
      @click="setSort('ASC')"
    >
      <template #icon><svg-sort-up /></template>
    </context-menu-item>
    <context-menu-item
      label="Сортировать"
      @click="setSort('DESC')"
    >
      <template #icon><svg-sort-down /></template>
    </context-menu-item>

    <context-menu-separator />

    <context-menu-item
      label="Фильтры недоступны"
      custom-class="no-hover"
      :click-close="false"
    >
      <template #icon><svg-filter-settings /></template>

      <template #label>
        <date-filter
          v-if="columnCurrent?.type === 'date'"
          @create-filter="createFilter"
        />
        <number-filter
          v-if="columnCurrent?.type === 'number'"
          @create-filter="createFilter"
        />
        <string-filter
          v-if="columnCurrent?.type === 'string' || columnCurrent?.type === 'string[]'"
          :column-type="columnCurrent?.type"
          @create-filter="createFilter"
        />
      </template>
    </context-menu-item>

    <template
      v-for="column of columns"
      :key="column.prop"
    >
      <template v-if="column.filters.length > 0">
        <context-menu-separator />
        <context-menu-group
          :click-close="false"
          :label="column.label"
        >
          <template #icon><svg-column /></template>

          <context-menu-item
            label="И"
            :click-close="false"
            :checked="column.operator === 'and'"
            @click="changeFilterOperator(column, 'and')"
          />
          <context-menu-item
            label="ИЛИ"
            :click-close="false"
            :checked="column.operator === 'or'"
            @click="changeFilterOperator(column, 'or')"
          />
        </context-menu-group>
      </template>
      <context-menu-item
        v-for="(filter, f_index) of column.filters"
        :key="column.prop + f_index"
        :label="`${FILTER_TYPE_LABEL[filter.type]}: ${filter.value}`"
        :click-close="false"
        @click="deleteFilter(column, filter)"
      >
        <template #icon><svg-close /></template>
      </context-menu-item>
    </template>

    <context-menu-separator />

    <context-menu-item
      label="Сбросить фильтры"
      :click-close="false"
      @click="resetFilter"
    >
      <template #icon><svg-filter-clear /></template>
    </context-menu-item>

    <context-menu-separator />

    <context-menu-group label="Настройки">
      <template #icon><svg-column-options /></template>

      <context-menu-item
        :label="`Автоширина ${isColumnAutoWidth ? '- ВЫКЛ' : '- ВКЛ'}`"
        :click-close="false"
        @click="onAutoWidth"
      >
        <template #icon><svg-auto-fit-window /></template>
      </context-menu-item>
      <context-menu-item
        :click-close="false"
        :disabled="isColumnAutoWidth"
        custom-class="no-hover"
      >
        <template #icon><svg-fit-width /></template>

        <template #label>
          <el-input-number
            v-model="columnWidth"
            :disabled="isColumnAutoWidth"
            :min="COLUMN_MIN_WIDTH"
            :max="1000"
            :step="5"
          />
        </template>
      </context-menu-item>

      <context-menu-separator />

      <context-menu-group label="Столбцы">
        <template #icon><svg-column-edit /></template>

        <context-menu-item
          label="Скрыть"
          @click="onHideCurrent"
        >
          <template #icon><svg-hide /></template>
        </context-menu-item>
        <context-menu-item
          label="Показать все"
          @click="onVisibleAll"
        >
          <template #icon><svg-view /></template>
        </context-menu-item>

        <context-menu-separator />

        <context-menu-item
          v-for="(column, index) of columns"
          :key="index"
          :label="column.label"
          :click-close="false"
          @click="setColumnVisible(column, !column.visible)"
          ><template #icon
            ><svg-view v-if="column.visible" /><svg-hide v-if="!column.visible"
          /></template>
        </context-menu-item>
      </context-menu-group>
    </context-menu-group>
  </context-menu>
</template>

<style>
.mx-context-menu.virt-table {
  /* --mx-menu-backgroud: #ffffff; */
  --mx-menu-hover-backgroud: var(--el-color-primary-light-9);

  --mx-menu-hover-text: var(--el-color-primary);

  --mx-menu-open-backgroud: var(--el-color-primary-light-8);
  --mx-menu-open-hover-backgroud: var(--el-color-primary-light-7);

  padding: 3px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-lighter);

  box-shadow: var(--el-box-shadow-light);

  & .no-hover:hover {
    background-color: var(--mx-menu-backgroud);
  }

  & .label {
    font-size: 12px;
    padding: 0;
  }

  & .mx-context-menu-item {
    padding: 2px 5px;
    line-height: 20px;
    font-size: 12px;
  }
}
</style>
