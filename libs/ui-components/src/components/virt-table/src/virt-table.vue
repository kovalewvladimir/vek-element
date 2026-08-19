<script
  setup
  lang="ts"
  generic="
    K extends string,
    T extends string,
    RowDataType extends Record<K, any> & Partial<Record<T, any>>
  "
>
import { useLoading, useScrollPosition } from '@vek-element/ui-components/hooks'
import { ElEmpty, ElTooltip } from 'element-plus'
import {
  computed,
  isReactive,
  onActivated,
  onMounted,
  provide,
  ref,
  toRaw,
  unref,
  useSlots,
  useTemplateRef,
  warn,
  watch
} from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { type Column, type Columns } from './column'
import { COLUMN_MIN_WIDTH } from './constants'
import {
  type IColumn,
  type IFindDataItemIndexOptions,
  type IPushDataItemOptions,
  type IPushDataTreeItemOptions,
  type ISummaryResolved,
  type IUpdateDataItemOptions,
  type IVirtTableExpose,
  type OnLoadDataType,
  type OnLoadSummaryType
} from './types'
import { useColumnResize } from './use-column-resize'
import { useSummary } from './use-summary'
import { useTooltip } from './use-tooltip'
import { useVirtualData } from './use-virtual-data'
import {
  getFormatData,
  getMetaData,
  getTreeLevel,
  getValueByPath,
  initMetaDataTree,
  injectFormatMetaData,
  isMetaActive
} from './utils'
import VirtTableHeaderCell from './virt-table-header-cell.vue'
import VirtTableMenu from './virt-table-menu.vue'
import VirtTableRow from './virt-table-row.vue'
import VirtTableTreeCell from './virt-table-tree-cell.vue'

// ==================
// Slots
// ==================

type ColumnProp = Column['prop']

defineSlots<{
  /** Слот для кастомного рендера ячейки. */
  [key: `${ColumnProp}`]: (props: { column: Column; row: RowDataType }) => unknown
  /** Слот для кастомного рендера заголовка колонки. */
  [key: `h-${ColumnProp}`]: (props: { column: Column }) => unknown
  /** Слот, который отображается перед ячейкой. */
  [key: `${ColumnProp}-before`]: (props: { column: Column; row: RowDataType }) => unknown
  /** Слот для кастомного рендера ячейки строки ИТОГО. */
  // `value` опционален, иначе тип слота не совместим с общим строковым индексом слотов колонок
  [key: `f-${ColumnProp}`]: (props: { column: Column; value?: any }) => unknown
}>()

// ==================
// Props
// ==================

const {
  columns,
  rowUniqueKey,
  dataSymbol,
  tree,
  summary,
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
  /** Уникальный ключ для таблицы */
  rowUniqueKey: K
  /** Символ для идентификации данных таблицы через useVirtTableData */
  dataSymbol?: symbol

  // eslint-disable-next-line vue/require-default-prop
  tree?: {
    /** Включить древовидную таблицу */
    enabled: boolean

    /** Функция загрузки данных */
    onLoadData: (row: RowDataType) => Promise<RowDataType[]>

    /** Ключ для дерева (по умолчанию isExpandable) */
    expandableKey: T

    /** Использовать кэшированные данные (по умолчанию true) */
    isCacheData?: boolean
    /** Клонировать данные при вставке в таблицу (по умолчанию false) */
    isCloneData?: boolean

    /** Величина отступа для уровня вложенности в пикселях (по умолчанию 20) */
    levelIndent?: number
  }

  // eslint-disable-next-line vue/require-default-prop
  summary?: {
    /** Включить строку ИТОГО */
    enabled: boolean

    /** Показывать подпись в первой видимой колонке (по умолчанию true) */
    showLabel?: boolean

    /** Подпись в первой видимой колонке (по умолчанию 'ИТОГО') */
    label?: string

    /** Функция загрузки итогов с сервера. Вызывается при монтировании и при reloadData */
    onLoad?: OnLoadSummaryType

    /** Учитывать дочерние строки дерева при расчёте (по умолчанию false) */
    includeTreeChildren?: boolean
  }

  /** Функция, которая вызывается при загрузке данных (обязательный параметр). */
  onLoadData: OnLoadDataType<RowDataType[]>

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
const treeComputed = computed<Required<NonNullable<typeof tree>>>(() => ({
  enabled: tree?.enabled ?? false,
  onLoadData: tree?.onLoadData ?? ((): Promise<RowDataType[]> => Promise.resolve([])),
  expandableKey: tree?.expandableKey ?? ('isExpandable' as T),
  isCacheData: tree?.isCacheData ?? true,
  isCloneData: tree?.isCloneData ?? false,
  levelIndent: tree?.levelIndent ?? 20
}))

// Устанавливаем значения по умолчанию для summary
const summaryComputed = computed<ISummaryResolved>(() => ({
  enabled: summary?.enabled ?? false,
  showLabel: summary?.showLabel ?? true,
  label: summary?.label ?? 'ИТОГО',
  onLoad: summary?.onLoad ?? null,
  includeTreeChildren: summary?.includeTreeChildren ?? false
}))

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
    // слоты строки ИТОГО
    if (column.slot) {
      validColumnSlots.add(`f-${column.slot}`)
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
  (e: 'changeActiveRow', row: RowDataType): void
}>()

// ==================
// Computed
// ==================

const rowHeightPx = computed(() => `${rowHeight}px`)
const headerHeightPx = computed(() => `${rowHeight + 6}px`)
const footerHeightPx = computed(() => (summaryComputed.value.enabled ? `${rowHeight}px` : '0px'))
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
  invalidateVirtualData,
  virtualContainerProps,
  virtualWrapperProps
} = useVirtualData<RowDataType>(
  onLoadData,
  columns,
  sizePage,
  rowHeight,
  virtualListOverscan,
  infiniteScrollDistance,
  dataSymbol
)

/**
 * В данные таблицы попадали дочерние строки дерева.
 *
 * Пока флаг не поднят, строка ИТОГО может считать по всему массиву без фильтрации по уровню.
 * Схлопывание узлов флаг не сбрасывает: это лишь вернёт фильтрацию, результат от неё не зависит.
 */
const hasNestedRows = ref(false)

// Строка ИТОГО
const { summaryValues, setSummary, loadSummary } = useSummary<RowDataType>(
  columns,
  data,
  isAllDataLoaded,
  summaryComputed,
  hasNestedRows
)

/** Перезагрузка данных таблицы вместе с итогами */
const reloadDataAndSummary = () => {
  reloadData()
  hasNestedRows.value = false
  void loadSummary()
}

onMounted(() => {
  void loadSummary()
})

// Строку ИТОГО могли включить уже после монтирования — серверные итоги ещё не загружены
watch(
  () => summaryComputed.value.enabled,
  (enabled) => {
    if (enabled) void loadSummary()
  }
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

/** Получение значения ячейки строки ИТОГО */
const getSummaryCellValue = (column: Column) => {
  const value = summaryValues.value[column.prop]
  if (value === null || value === undefined) return ''

  const formatter = column.summaryFormatter ?? column.formatter
  return formatter ? formatter(value) : value
}

/** Колонка, в которой выводится подпись ИТОГО (первая видимая, если у неё нет своего значения) */
const summaryLabelProp = computed<string | null>(() => {
  if (!summaryComputed.value.showLabel) return null

  const [first] = computedVisibleColumns.value
  if (!first) return null
  return summaryValues.value[first.prop] === undefined ? first.prop : null
})

// ===================================
// Изменение ширины колонок
// ===================================

const tableRootRef = useTemplateRef<HTMLElement>('tableRootRef')
const resizeIndicatorRef = useTemplateRef<HTMLElement>('resizeIndicatorRef')
const { isResizing, startResize } = useColumnResize(tableRootRef, resizeIndicatorRef)

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
    reloadDataAndSummary()
  }
}

// ===================================
// Обработчик клика по строке
// ===================================

/** Обработчик клика по строке */
function handleRowClick(row: any) {
  const meta = getMetaData(row)
  if (meta.isActive) return

  // Ищем по сырым строкам, а сбрасываем флаг через прокси:
  // запись в сырой объект не разбудит рендер и подсветка не снимется
  const rows = toRaw(data.value)
  // eslint-disable-next-line unicorn/no-for-loop -- rows.entries() втрое медленнее на 100k строк
  for (let i = 0; i < rows.length; i++) {
    if (isMetaActive(rows[i])) getMetaData(data.value[i]).isActive = false
  }

  meta.isActive = true

  emit('changeActiveRow', row)
}

// ===================================
// Методы для древовидной таблицы
// ===================================

/** Поиск количества элементов на уровне */
function countItemsAtLevel(startIndex: number, level: number) {
  // Только чтение — сырые строки дешевле, getTreeLevel в отличие от getMetaData ничего не создаёт
  const rows = toRaw(unref(data))

  let count = 0
  for (let i = startIndex + 1; i < rows.length; i++) {
    if (getTreeLevel(rows[i]) <= level) break
    count++
  }
  return count
}

/** Обработчик клика по стрелке дерева */
async function handleTreeCellClick(row: RowDataType) {
  const { loadingWrapper: loadingWrapperTree } = useLoading(0)

  const meta = getMetaData(row)
  meta.tree = meta.tree ?? initMetaDataTree<RowDataType>()
  const { tree: metaTree } = meta

  await loadingWrapperTree(async () => {
    const currentLevel: number = metaTree.level

    // Если элемент уже открыт, то удаляем все элементы ниже него
    if (metaTree.isOpen) {
      const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })

      const countItemDelete = countItemsAtLevel(index, currentLevel)
      const deleteData = deleteDataItems(index + 1, countItemDelete)

      if (treeComputed.value.isCacheData) metaTree.cache = deleteData

      metaTree.isOpen = false
      return
    }

    // Если элемент открыт, то проверяем кэшированные данные
    if (treeComputed.value.isCacheData && metaTree.cache.length > 0) {
      const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })

      pushDataItem(metaTree.cache, {
        index: index + 1,
        isCloneData: treeComputed.value.isCloneData
      })
      if (metaTree.cache.length > 0) hasNestedRows.value = true
      metaTree.isOpen = true
      return
    }

    // Если элемент не открыт, то загружаем данные
    metaTree.isLoading = true
    const _newData = await treeComputed.value.onLoadData(row)
    for (const item of _newData) {
      const itemMeta = getMetaData(item)
      itemMeta.tree = itemMeta.tree ?? initMetaDataTree<RowDataType>({ level: currentLevel + 1 })
    }
    const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })
    pushDataItem(_newData, { index: index + 1, isCloneData: treeComputed.value.isCloneData })
    if (_newData.length > 0) hasNestedRows.value = true
    metaTree.isOpen = true
  })()

  metaTree.isLoading = false
}

/** Переключение состояния раскрытия строки */
async function toggleRowExpansion(index: number, expanded?: boolean) {
  const row = data.value[index]
  if (!row) throw new Error('Row not found')

  const meta = getMetaData(row)

  if (!row[treeComputed.value.expandableKey]) return

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

/** Вставка элемента в конкретный узел древовидной таблицы */
async function pushDataTreeItem(
  row: RowDataType,
  item: RowDataType | RowDataType[],
  options: IPushDataTreeItemOptions = {}
) {
  const { isCloneData = true, isShouldOpen = true } = options

  const index = findDataItemIndex(row[rowUniqueKey], { throwIfNotFound: true })
  const _item = isCloneData ? structuredClone(item) : item
  const metaRow = getMetaData(row)
  if (!metaRow.tree) metaRow.tree = initMetaDataTree<RowDataType>()

  if (Array.isArray(_item)) {
    throw new TypeError('Not implemented')
  } else {
    const metaItem = getMetaData(_item)
    injectFormatMetaData(_item, columns)
    metaItem.tree = initMetaDataTree<RowDataType>({
      level: metaRow.tree.level + 1
    })

    // Если строка открыта
    if (metaRow.tree.isOpen) {
      const countItemLevel = countItemsAtLevel(index, metaRow.tree.level)
      data.value.splice(index + countItemLevel + 1, 0, _item)
      hasNestedRows.value = true
    }

    // Если строка закрыта
    if (!metaRow.tree.isOpen) {
      // И в ней уже есть дочерние элементы
      if (treeComputed.value.isCacheData && metaRow.tree.cache.length > 0) {
        metaRow.tree.cache.push(_item)
      }

      // И в ней нет дочерних элементов
      if (!row[treeComputed.value.expandableKey]) {
        ;(row as any)[treeComputed.value.expandableKey] = true

        if (treeComputed.value.isCacheData) {
          metaRow.tree.cache.push(_item)
        }
      }

      // Открываем строку при необходимости
      if (isShouldOpen) {
        await toggleRowExpansion(index, true)
      }
    }
  }

  invalidateVirtualData()
}

// ===================================
// Работа с данными таблицы
// ===================================

/** Поиск индекса элемента в таблице */
const findDataItemIndex = (value: any, options: IFindDataItemIndexOptions = {}) => {
  const { throwIfNotFound = false } = options
  // Зависимость от длины нужна, если метод вызывают внутри вычисляемого свойства:
  // поиск идёт по сырому массиву и сам ничего не трекает
  void data.value.length
  const index = toRaw(data.value).findIndex((i) => i[rowUniqueKey] === value)
  if (index === -1 && throwIfNotFound) {
    throw new Error(`Item not found.`)
  }
  return index
}
/** Добавление нового элемента в таблицу */
const pushDataItem = (item: RowDataType | RowDataType[], options: IPushDataItemOptions = {}) => {
  const { index = 0, isCloneData = true } = options

  const _item = isCloneData ? structuredClone(item) : item

  if (Array.isArray(_item)) {
    for (const i of _item) injectFormatMetaData(i, columns)
    data.value.splice(index, 0, ..._item)
  } else {
    injectFormatMetaData(_item, columns)
    data.value.splice(index, 0, _item)
  }

  invalidateVirtualData()
}
/** Изменение данных в таблице */
const updateDataItem = (item: any, options: IUpdateDataItemOptions) => {
  const { index, isCloneData = true } = options

  if (data.value.length <= index) return

  const _item = isCloneData ? structuredClone(item) : item
  injectFormatMetaData(_item, columns)
  data.value.splice(index, 1, _item)

  invalidateVirtualData()
}
/** Удаление элемента из таблицы */
const deleteDataItem = (index: number) => {
  const deleteData = data.value.splice(index, 1)
  invalidateVirtualData()
  if (deleteData.length === 0) return null
  return deleteData[0]
}
/** Удаление нескольких элементов из таблицы */
const deleteDataItems = (index: number, count: number) => {
  const deleteData = data.value.splice(index, count)
  invalidateVirtualData()
  return deleteData
}

// ==================
// Expose
// ==================

const virtTableApi: IVirtTableExpose<RowDataType> = {
  reloadData: reloadDataAndSummary,
  data,
  findDataItemIndex,
  pushDataItem,
  pushDataTreeItem,
  updateDataItem,
  deleteDataItem,
  deleteDataItems,
  toggleRowExpansion,
  setSummary,
  reloadSummary: loadSummary
}

defineExpose<IVirtTableExpose<RowDataType>>(virtTableApi)

// ==================
// Provide
// ==================

provide<IVirtTableExpose<RowDataType>>('virt-table-api', virtTableApi)
</script>

<template>
  <div
    ref="tableRootRef"
    v-loading="loading"
    v-bind="$attrs"
    class="virt-table-root relative"
    :style="`height: ${height}`"
  >
    <div
      v-bind="virtualContainerProps"
      class="virt-table-body"
      data-testid="virt-table-body"
    >
      <!-- Header -->
      <div class="header">
        <virt-table-row
          :columns="computedVisibleColumns"
          is-header
          @click="onSortColumn"
          @contextmenu="onShowContextMenu"
          @resize-start="startResize"
        >
          <template #default="{ column }">
            <slot
              :name="`h-${column.prop}`"
              :column="column"
            >
              <virt-table-header-cell
                :column="column"
                @mouseenter="handleCellMouseEnter"
                @mouseleave="handleCellMouseLeave"
              />
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
          v-memo="[row, getMetaData(row).isActive, computedVisibleColumns]"
          class="row"
          :class="{ active: getMetaData(row).isActive }"
          @click="handleRowClick(row)"
        >
          <virt-table-row :columns="computedVisibleColumns">
            <template #default="{ column, index }">
              <virt-table-tree-cell
                v-if="treeComputed.enabled && index === 0"
                :row="row"
                :expandable-key="treeComputed.expandableKey"
                :level-indent="treeComputed.levelIndent"
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

      <!-- Summary -->
      <div
        v-if="summaryComputed.enabled"
        class="footer"
        data-testid="virt-table-footer"
      >
        <virt-table-row :columns="computedVisibleColumns">
          <template #default="{ column }">
            <div
              class="text"
              :class="{ 'text-right w-full': column.align === 'right' }"
              @mouseenter="handleCellMouseEnter($event, column)"
              @mouseleave="handleCellMouseLeave($event, column)"
            >
              <slot
                :name="`f-${column.slot}`"
                :column="column"
                :value="summaryValues[column.prop]"
                >{{
                  column.prop === summaryLabelProp
                    ? summaryComputed.label
                    : getSummaryCellValue(column)
                }}</slot
              >
            </div>
          </template>
        </virt-table-row>
      </div>
    </div>

    <!-- Линия-указатель при изменении ширины колонки -->
    <div
      v-show="isResizing"
      ref="resizeIndicatorRef"
      class="resize-indicator"
    ></div>

    <div
      class="absolute bottom-[-8px] right-0 text-6px color-gray"
      data-testid="virt-table-stats"
    >
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
    @change-sort="reloadDataAndSummary"
    @change-filter="reloadDataAndSummary"
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

    height: calc(100% - v-bind('headerHeightPx') - v-bind('footerHeightPx'));
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

  & .footer {
    display: flex;
    position: sticky;
    bottom: 0;
    z-index: 2;

    font-weight: 600;

    & .cell {
      background: var(--table-header-bg-color);

      border-top: var(--table-border);
      border-bottom: none;
    }
  }

  & .cell {
    position: relative;
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

    & .resize-handle {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3;

      width: 8px;
      height: 100%;

      cursor: col-resize;
      user-select: none;
    }

    & .resize-handle:hover {
      background: var(--el-color-primary-light-5);
    }
  }

  .cell:last-child {
    border-right: none;
  }
}

.virt-table-root {
  & .resize-indicator {
    position: absolute;
    top: 0;
    /* Позиция задаётся через transform из useColumnResize */
    left: 0;
    z-index: 10;

    width: 2px;
    height: 100%;

    background: var(--el-color-primary);
    pointer-events: none;
  }
}
</style>
