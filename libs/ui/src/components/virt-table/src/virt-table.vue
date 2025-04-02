<script setup lang="ts">
import { ElEmpty, ElTooltip } from 'element-plus'
import { computed, isReactive, onActivated, provide, useTemplateRef, warn } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { type Column, type Columns } from './column'
import { COLUMN_MIN_WIDTH } from './constants'
import {
  type IColumn,
  type ICreateDataItemOptions,
  type IUpdateDataItemOptions,
  type IVirtTableExpose,
  type OnLoadDataType
} from './types'
import { useScrollPosition } from './use-scroll-position'
import { useTooltip } from './use-tooltip'
import { useVirtualData } from './use-virtual-data'
import { getFormatData, getValueByPath, injectMetaData } from './utils'
import VirtTableHeaderCell from './virt-table-header-cell.vue'
import VirtTableMenu from './virt-table-menu.vue'
import VirtTableRow from './virt-table-row.vue'

// ==================
// Props
// ==================

const {
  columns,
  rowUniqueKey = 'id',
  onLoadData,
  height = '300px',
  rowHeight = 28,
  sizePage = 100,
  virtualListOverscan = 10,
  infiniteScrollDistance = 10,
  tooltipShowDelay = 500
} = defineProps<{
  /** Список колонок для отображения в таблице (обязательный параметр). */
  columns: Columns
  /** Уникальный ключ для таблицы (по умолчанию 'id'). */
  rowUniqueKey?: string

  /** Функция, которая вызывается при загрузке данных (обязательный параметр). */
  onLoadData: OnLoadDataType

  /** Высота таблицы (по умолчанию '300px'). */
  height?: string
  /** Высота строки таблицы (по умолчанию 28). */
  rowHeight?: number

  /** Кол-во строк в одной странице (по умолчанию 100). */
  sizePage?: number
  /** Количество "лишних" элементов виртуального списка (по умолчанию 10). */
  virtualListOverscan?: number
  /** Расстояние до нижней части таблицы, когда начинается бесконечная прокрутка (по умолчанию 10) */
  infiniteScrollDistance?: number

  /** Задержка перед показом всплывающей подсказки (по умолчанию 500 миллисекунд). */
  tooltipShowDelay?: number
}>()

// ==================
// Validate
// ==================

/** Валидация колонок */
function validateColumns() {
  if (!isReactive(columns)) warn('`columns` должен быть реактивным')
}

/** Валидация слотов  */
function validateSlots() {
  const slots = useSlots()
  const slotNames = Object.keys(slots)

  // Получаем все валидные имена слотов из колонок
  const validColumnSlots = new Set()
  for (const column of columns) {
    // слоты заголовков
    if (`h-${column.prop}`) {
      validColumnSlots.add(`h-${column.prop}`)
    }
    // основные слоты колонок
    if (column.slot) {
      validColumnSlots.add(column.slot)
    }
    // слоты before
    if (column.slot) {
      validColumnSlots.add(`${column.slot}-before`)
    }
  }

  // Проверяем каждый используемый слот
  for (const slotName of slotNames) {
    if (!validColumnSlots.has(slotName)) {
      warn(
        `Неверное имя слота "${slotName}". Допустимые имена слотов: ${[...validColumnSlots].join(', ')}`
      )
    }
  }
}

validateColumns()
validateSlots()

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

/** Фильтрация видимых колонок */
const computedVisibleColumns = computed<Column[]>(() => {
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
  return column.formatter ? getFormatData(row, column.prop) : getValueByPath(row, column.prop)
}

// ===================================
// Работа с данными таблицы данных
// ===================================

/** Поиск индекса элемента в таблице */
const findDataItemIndex = (value: any) => {
  return data.value.findIndex((i) => i[rowUniqueKey] === value)
}
/** Добавление нового элемента в таблицу */
const createDataItem = (item: any, options: ICreateDataItemOptions = {}) => {
  const { index = 0, isCloneData = true } = options

  const _item = isCloneData ? structuredClone(item) : item

  if (Array.isArray(_item)) {
    for (const i of _item) injectMetaData(i, columns)
    data.value.splice(index, 0, ..._item)
  } else {
    injectMetaData(_item, columns)
    data.value.splice(index, 0, _item)
  }

  virtualContainerProps.onScroll()
}
/** Изменение данных в таблице */
const updateDataItem = (item: any, options: IUpdateDataItemOptions) => {
  const { index, isCloneData = true } = options

  if (data.value.length <= index) return

  const _item = isCloneData ? structuredClone(item) : item
  injectMetaData(_item, columns)
  data.value.splice(index, 1, _item)

  virtualContainerProps.onScroll()
}
/** Удаление элемента из таблицы */
const deleteDataItem = (index: number) => {
  const deleteData = data.value.splice(index, 1)
  virtualContainerProps.onScroll()
  if (deleteData.length === 0) return null
  return deleteData[0]
}
/** Удаление нескольких элементов из таблицы */
const deleteDataItems = (index: number, count: number) => {
  const deleteData = data.value.splice(index, count)
  virtualContainerProps.onScroll()
  return deleteData
}

// ==================
// Expose
// ==================

defineExpose<IVirtTableExpose>({
  reloadData,
  data,
  findDataItemIndex,
  createDataItem,
  updateDataItem,
  deleteDataItem,
  deleteDataItems
})

// ==================
// Provide
// ==================

provide<IVirtTableExpose>('virt-table-api', {
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
          :columns="computedVisibleColumns"
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
          <virt-table-row :columns="computedVisibleColumns">
            <template #default="{ column }">
              <slot
                :name="`${column.slot}-before`"
                :column="column"
                :row="row"
              />
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
