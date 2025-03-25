<script setup lang="ts">
import { ElEmpty, ElTooltip } from 'element-plus'
import { computed, isReactive, onActivated, type Ref, useTemplateRef, warn } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { type Column, type Columns } from './column'
import { COLUMN_MIN_WIDTH } from './constants'
import { type IColumn, type OnLoadDataType } from './types'
import { useScrollPosition } from './use-scroll-position'
import { useTooltip } from './use-tooltip'
import { createFormattedData, useVirtualData } from './use-virtual-data'
import { getValueByPath } from './utils'
import VirtTableHeaderCell from './virt-table-header-cell.vue'
import VirtTableMenu from './virt-table-menu.vue'
import VirtTableRow from './virt-table-row.vue'

// ==================
// Props
// ==================

const {
  columns,
  onLoadData,
  rowUniqueKey = 'id',
  sizePage = 100,
  height = '300px',
  rowHeight = 28,
  virtualListOverscan = 10,
  infiniteScrollDistance = 10,
  tooltipShowDelay = 500
} = defineProps<{
  /**
   * Список колонок для отображения в таблице (обязательный параметр).
   */
  columns: Columns
  /**
   * Уникальный ключ для таблицы (по умолчанию 'id').
   */
  rowUniqueKey?: string
  /**
   * Функция, которая вызывается при загрузке данных (обязательный параметр).
   */
  onLoadData: OnLoadDataType
  /**
   * Кол-во строк в одной странице (по умолчанию 100).
   */
  sizePage?: number
  /**
   * Высота таблицы (по умолчанию '300px').
   */
  height?: string
  /**
   * Высота строки таблицы (по умолчанию 28).
   */
  rowHeight?: number
  /**
   * Количество "лишних" элементов виртуального списка (по умолчанию 10).
   */
  virtualListOverscan?: number
  /**
   * Расстояние до нижней части таблицы, когда начинается бесконечная прокрутка (по умолчанию 10)
   */
  infiniteScrollDistance?: number
  /**
   * Задержка перед показом всплывающей подсказки (по умолчанию 500 миллисекунд).
   */
  tooltipShowDelay?: number
}>()

// Проверка на реактивность
if (!isReactive(columns)) {
  warn('`columns` должен быть реактивным')
}

// ==================
// Lifecycle
// ==================

// Восстановление позиции scroll при переходе по страницам
onActivated(() => {
  restoreScrollPosition()
})
onBeforeRouteLeave(() => {
  saveScrollPosition()
})

// ==================
// Computed
// ==================

const rowHeightPx = computed(() => `${rowHeight}px`)
const headerHeightPx = computed(() => `${rowHeight + 6}px`)
const columnMinWidthPx = computed(() => `${COLUMN_MIN_WIDTH}px`)

// ==================
// Methods
// ==================

// Виртуальный список
const {
  loading,
  isAllDataLoaded,
  data,
  reloadData,
  currentPage,
  virtualData,
  virtualContainerProps,
  virtualWrapperProps
} = useVirtualData(
  onLoadData,
  columns,
  sizePage,
  rowHeight,
  virtualListOverscan,
  infiniteScrollDistance
)

// Scroll для vue-router
const { saveScrollPosition, restoreScrollPosition } = useScrollPosition(virtualContainerProps.ref)

// tooltip
const {
  tooltipVisible,
  tooltipContent,
  tooltipTriggerRef,
  handleCellMouseEnter,
  handleCellMouseLeave
} = useTooltip(tooltipShowDelay)

// Контекстное меню
const virtTableMenuRef = useTemplateRef('virtTableMenuRef')
const onShowContextMenu = (e: MouseEvent, column: Column) => {
  if (column.menu) virtTableMenuRef.value?.onShowContextMenu(e, column)
}
const onSortColumn = (_e: MouseEvent, column: Column) => {
  if (column.menu) {
    const sort = column.sort
    columns.setSort(column, sort === 'ASC' ? 'DESC' : 'ASC')
    void reloadData()
  }
}

/** Получение значения ячейки */
const getCellValue = (row: any, column: IColumn) => {
  const path = column.formatter ? `__formatData.${column.prop}` : column.prop
  return getValueByPath(row, path)
}

// ===================================
// Работа с данными таблицы данных
// ===================================

interface ICreateDataItemOptions {
  /** Индекс, куда вставить новый элемент */
  index?: number
  /** Данные являются массивом? */
  isDataArray?: boolean
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}
interface IUpdateDataItemOptions {
  /** Идентификатор элемента */
  index: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}

/** Поиск индекса элемента в таблице */
const findDataItemIndex = (item: any, identifier: string) => {
  return data.value.findIndex((i) => i[identifier] === item)
}
/** Добавление нового элемента в таблицу */
const createDataItem = (item: any, options: ICreateDataItemOptions = {}) => {
  const { index = 0, isCloneData = true } = options

  const _item = isCloneData ? structuredClone(item) : item

  if (Array.isArray(_item)) {
    for (const i of _item) i.__formatData = createFormattedData(i, columns)
    data.value.splice(index, 0, ..._item)
  } else {
    _item.__formatData = createFormattedData(_item, columns)
    data.value.splice(index, 0, _item)
  }

  virtualContainerProps.onScroll()
}
/** Изменение данных в таблице */
const updateDataItem = (item: any, options: IUpdateDataItemOptions) => {
  const { index, isCloneData = true } = options

  if (data.value.length <= index) return

  const _item = isCloneData ? structuredClone(item) : item
  _item.__formatData = createFormattedData(_item, columns)
  data.value.splice(index, 1, _item)

  virtualContainerProps.onScroll()
}
/** Удаление элемента из таблицы */
const deleteDataItem = (index: number) => {
  data.value.splice(index, 1)
  virtualContainerProps.onScroll()
}
/** Удаление нескольких элементов из таблицы */
const deleteDataItems = (index: number, count: number) => {
  data.value.splice(index, count)
  virtualContainerProps.onScroll()
}

// ==================
// Expose
// ==================

defineExpose<{
  /** Функция для перезагрузки данных */
  reloadData: () => Promise<void>

  /** Данные таблицы */
  data: Ref<any[]>
  /** Функция для поиска индекса элемента в таблице */
  findDataItemIndex: (item: any, identifier: string) => number
  /** Функция для создания нового элемента в таблице */
  createDataItem: (item: any, options?: ICreateDataItemOptions) => void
  /** Функция для обновления данных в таблице */
  updateDataItem: (item: any, options: IUpdateDataItemOptions) => void
  /** Функция для удаления элемента из таблицы */
  deleteDataItem: (index: number) => void
  /** Функция для удаления нескольких элементов из таблицы */
  deleteDataItems: (index: number, count: number) => void
}>({
  reloadData,
  data,
  findDataItemIndex,
  createDataItem,
  updateDataItem,
  deleteDataItem,
  deleteDataItems
})
</script>

<template>
  <div
    v-loading="loading"
    v-bind="$attrs"
    class="relative"
    :style="`height: ${height}`"
  >
    <div
      v-bind="virtualContainerProps"
      class="virt-table-body"
    >
      <!-- Header -->
      <div class="header">
        <virt-table-row
          :columns="columns"
          @click="onSortColumn"
          @contextmenu="onShowContextMenu"
        >
          <template #default="{ column }">
            <slot
              :name="`h-${column.prop}`"
              :column="column"
            >
              <virt-table-header-cell :column="column" />
            </slot>
          </template>
        </virt-table-row>
      </div>

      <!-- Rows -->
      <div
        v-if="data.length > 0"
        v-bind="virtualWrapperProps"
      >
        <div
          v-for="{ data: row } in virtualData"
          :key="row[rowUniqueKey]"
          class="row"
        >
          <virt-table-row :columns="columns">
            <template #default="{ column }">
              <div
                class="text"
                :class="{ 'text-right w-full': column.align === 'right' }"
                @mouseenter="handleCellMouseEnter($event, column)"
                @mouseleave="handleCellMouseLeave($event, column)"
              >
                <slot
                  :name="column.slot"
                  :column="column"
                  :row="row"
                  >{{ getCellValue(row, column) }}</slot
                >
              </div>
            </template>
          </virt-table-row>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="empty"
        ><el-empty description="Нет данных"
      /></div>
    </div>

    <div class="absolute bottom-[-8px] right-0 text-6px color-gray">
      <span>Page: {{ currentPage }} | </span>
      <span>Size: {{ sizePage }} | </span>
      <span>isAllDataLoaded: {{ isAllDataLoaded }} | </span>
      <span>Count: {{ data.length }} | </span>
      <span>Count virtual: {{ virtualData.length }}</span>
    </div>
  </div>

  <el-tooltip
    v-model:visible="tooltipVisible"
    :content="tooltipContent"
    placement="top"
    virtual-triggering
    :virtual-ref="tooltipTriggerRef"
  />

  <virt-table-menu
    ref="virtTableMenuRef"
    :columns="columns"
    @change-sort="reloadData"
    @change-filter="reloadData"
  />
</template>

<style>
.virt-table-body {
  --table-border-color: var(--el-border-color-lighter);
  --table-border: 1px solid var(--table-border-color);

  --table-row-bg-color: var(--el-fill-color-blank);
  --table-header-bg-color: var(--el-fill-color-light);

  color: var(--el-text-color-regular);
  font-size: 12px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  border: var(--table-border);

  & .empty {
    display: flex;
    justify-content: center;
    align-items: center;

    height: calc(100% - v-bind('headerHeightPx'));
    font-size: 24px;
    overflow: hidden;
  }

  & .header {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 2;

    color: var(--el-text-color-secondary);
    font-weight: 600;

    & .cell {
      height: v-bind('headerHeightPx');
      /* line-height: v-bind('headerHeight'); */

      background: var(--table-header-bg-color);
    }
  }

  & .row {
    display: flex;
  }

  & .cell {
    flex: 1 1 0%;
    min-width: v-bind('columnMinWidthPx');

    display: flex;
    align-items: center;

    height: v-bind('rowHeightPx');
    /* line-height: v-bind('rowHeightPx'); */
    padding: 0 5px;

    box-sizing: border-box;

    background: var(--table-row-bg-color);

    border-right: var(--table-border);
    border-bottom: var(--table-border);

    & div.text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .cell:last-child {
    border-right: none;
  }
}
</style>
