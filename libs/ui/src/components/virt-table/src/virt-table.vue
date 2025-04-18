<script setup lang="ts">
import { useLoading } from '@vek-element/ui'
import { ElEmpty, ElTooltip } from 'element-plus'
import {
  computed,
  isReactive,
  onActivated,
  provide,
  unref,
  useSlots,
  useTemplateRef,
  warn
} from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { type Column, type Columns } from './column'
import { COLUMN_MIN_WIDTH } from './constants'
import {
  type IColumn,
  type ICreateDataItemOptions,
  type IFindDataItemIndexOptions,
  type IUpdateDataItemOptions,
  type IVirtTableExpose,
  type OnLoadDataType
} from './types'
import { useScrollPosition } from './use-scroll-position'
import { useTooltip } from './use-tooltip'
import { useVirtualData } from './use-virtual-data'
import { getFormatData, getMetaData, getValueByPath, injectFormatMetaData } from './utils'
import VirtTableHeaderCell from './virt-table-header-cell.vue'
import VirtTableMenu from './virt-table-menu.vue'
import VirtTableRow from './virt-table-row.vue'
import virtTableTreeCell from './virt-table-tree-cell.vue'

// ==================
// Props
// ==================

const {
  columns,
  rowUniqueKey = 'id',
  tree = {
    enabled: false,
    onLoadData: () => Promise.resolve([])
  },
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

  tree?: {
    /** Включить древовидную таблицу */
    enabled: boolean

    /** Функция загрузки данных */
    onLoadData: (row: any) => Promise<any[]>

    /** Ключ для дерева (по умолчанию isExpandable) */
    expandableKey?: string

    /** Использовать кэшированные данные (по умолчанию true) */
    isCacheData?: boolean
    /** Клонировать данные при вставке в таблицу (по умолчанию false) */
    isCloneData?: boolean

    /** Величина отступа для уровня вложенности в пикселях (по умолчанию 20) */
    levelIndent?: number
  }

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

// Устанавливаем значения по умолчанию для tree
const _tree: Required<NonNullable<typeof tree>> = {
  ...tree,
  expandableKey: tree.expandableKey ?? 'isExpandable',
  isCacheData: tree.isCacheData ?? true,
  isCloneData: tree.isCloneData ?? false,
  levelIndent: tree.levelIndent ?? 20
}

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
// Emit
// ==================

const emit = defineEmits<{
  (e: 'changeActiveRow', row: any): void
}>()

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

/** Получение значения ячейки */
const getCellValue = (row: any, column: IColumn) => {
  return column.formatter ? getFormatData(row, column.prop) : getValueByPath(row, column.prop)
}

// ===================================
// Контекстное меню
// ===================================

const virtTableMenuRef = useTemplateRef('virtTableMenuRef')

/** Обработчик контекстного меню */
function onShowContextMenu(e: MouseEvent, column: Column) {
  if (column.menu) virtTableMenuRef.value?.onShowContextMenu(e, column)
}

/** Обработчик сортировки колонки */
function onSortColumn(_e: MouseEvent, column: Column) {
  if (column.menu) {
    const sort = column.sort
    columns.setSort(column, sort === 'ASC' ? 'DESC' : 'ASC')
    void reloadData()
  }
}

// ===================================
// Обработчик клика по строке
// ===================================

/** Обработчик клика по строке */
function handleRowClick(row: any) {
  const meta = getMetaData(row)
  if (meta.isActive) return

  for (const _data of data.value) {
    const _meta = getMetaData(_data)
    _meta.isActive = false
  }

  meta.isActive = true

  emit('changeActiveRow', row)
}

// ===================================
// Методы для древовидной таблицы
// ===================================

/** Поиск количества элементов на уровне */
function countItemsAtLevel(startIndex: number, level: number) {
  const _data = unref(data)

  let count = 0
  for (let i = startIndex + 1; i < _data.length; i++) {
    const meta = getMetaData(data.value[i])
    const dataLevel = meta?.tree?.level ?? 0
    if (dataLevel <= level) break
    count++
  }
  return count
}

/** Обработчик клика по стрелке дерева */
async function handleTreeCellClick(row: any) {
  const { loadingWrapper: loadingWrapperTree } = useLoading(0)

  const meta = getMetaData(row)
  meta.tree = meta.tree ?? {
    isLoading: false,
    isOpen: false,
    level: 0,
    cache: []
  }
  const { tree: metaTree } = meta

  await loadingWrapperTree(async () => {
    const currentLevel: number = metaTree.level

    // Если элемент уже открыт, то удаляем все элементы ниже него
    if (metaTree.isOpen) {
      const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })

      const countItemDelete = countItemsAtLevel(index, currentLevel)
      const deleteData = deleteDataItems(index + 1, countItemDelete)

      if (_tree.isCacheData) metaTree.cache = deleteData

      metaTree.isOpen = false
      return
    }

    // Если элемент открыт, то проверяем кэшированные данные
    if (_tree.isCacheData && metaTree.cache.length > 0) {
      const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })

      createDataItem(metaTree.cache, { index: index + 1, isCloneData: _tree.isCloneData })
      metaTree.isOpen = true
      return
    }

    // Если элемент не открыт, то загружаем данные
    metaTree.isLoading = true
    const _newData = await _tree.onLoadData(row)
    for (const item of _newData) {
      const itemMeta = getMetaData(item)
      itemMeta.tree = itemMeta.tree ?? {
        isLoading: false,
        isOpen: false,
        level: currentLevel + 1,
        cache: []
      }
    }
    const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })
    createDataItem(_newData, { index: index + 1, isCloneData: _tree.isCloneData })
    metaTree.isOpen = true
  })()

  metaTree.isLoading = false
}

/** Переключение состояния раскрытия строки */
async function toggleRowExpansion(index: number, expanded?: boolean) {
  const row = data.value[index]
  if (!row) throw new Error('Row not found')

  const meta = getMetaData(row)

  if (!row[_tree.expandableKey]) return

  if (expanded === undefined) {
    await handleTreeCellClick(row)
    return
  }

  if (expanded) {
    if (meta?.tree?.isOpen) return
    await handleTreeCellClick(row)
    return
  }

  if (!meta?.tree?.isOpen) return
  await handleTreeCellClick(row)
}

// ===================================
// Работа с данными таблицы
// ===================================

/** Поиск индекса элемента в таблице */
const findDataItemIndex = (value: any, options: IFindDataItemIndexOptions = {}) => {
  const { throwIfNotFound = false } = options
  const index = data.value.findIndex((i) => i[rowUniqueKey] === value)
  if (index === -1 && throwIfNotFound) {
    throw new Error(`Item not found.`)
  }
  return index
}
/** Добавление нового элемента в таблицу */
const createDataItem = (item: any, options: ICreateDataItemOptions = {}) => {
  const { index = 0, isCloneData = true } = options

  const _item = isCloneData ? structuredClone(item) : item

  if (Array.isArray(_item)) {
    for (const i of _item) injectFormatMetaData(i, columns)
    data.value.splice(index, 0, ..._item)
  } else {
    injectFormatMetaData(_item, columns)
    data.value.splice(index, 0, _item)
  }

  virtualContainerProps.onScroll()
}
/** Изменение данных в таблице */
const updateDataItem = (item: any, options: IUpdateDataItemOptions) => {
  const { index, isCloneData = true } = options

  if (data.value.length <= index) return

  const _item = isCloneData ? structuredClone(item) : item
  injectFormatMetaData(_item, columns)
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
  deleteDataItems,
  toggleRowExpansion
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
  deleteDataItems,
  toggleRowExpansion
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
          :class="{ active: getMetaData(row).isActive }"
          @click="handleRowClick(row)"
        >
          <virt-table-row :columns="computedVisibleColumns">
            <template #default="{ column, index }">
              <virt-table-tree-cell
                v-if="_tree.enabled && index === 0"
                :row="row"
                :expandable-key="_tree.expandableKey"
                :level-indent="_tree.levelIndent"
                @click="handleTreeCellClick(row)"
              />

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
  border-radius: var(--el-border-radius-base);

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

  & .row.active .cell {
    background-color: var(--el-fill-color-light);
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
