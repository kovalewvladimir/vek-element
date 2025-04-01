<script setup lang="ts">
import { type IVirtTableExpose, useLoading, VuIconSvgSlot } from '@vek-element/ui'
import { computed, inject, unref } from 'vue'

import { SvgArrowRight, SvgLoading } from './svgs'

// ==================
// Inject
// ==================

const apiTable = inject<IVirtTableExpose>('virt-table-api')

// ==================
// Composable
// ==================

const { loading, loadingWrapper } = useLoading(0)

// ==================
// Props
// ==================

const {
  row,
  uniqueKey,
  expandableKey = 'isExpandable',
  onLoadData,
  isCacheData = true,
  isCloneData = false,
  levelIndent = 20
} = defineProps<{
  /** Данные строки */
  row: any
  /** Уникальный ключ строки */
  uniqueKey: string
  /** Ключ для дерева (по умолчанию isExpandable) */
  expandableKey?: string
  /** Функция загрузки данных */
  onLoadData: (row: any) => Promise<any[]>
  /** Использовать кэшированные данные (по умолчанию true) */
  isCacheData?: boolean
  /** Клонировать данные при вставке в таблицу (по умолчанию false) */
  isCloneData?: boolean
  /** Величина отступа для уровня вложенности в пикселях (по умолчанию 20) */
  levelIndent?: number
}>()

// ==================
// Variables
// ==================

const currentLevel: number = row.__level ?? 0
let cache: any[] = []

// ==================
// Computed
// ==================

const indentStyle = computed(() => ({
  flex: `0 0 ${levelIndent * currentLevel}px`
}))

// ==================
// Methods
// ==================

/** Поиск количества элементов на уровне */
function countItemsAtLevel(startIndex: number, dataItems: any[], level: number) {
  let count = 0
  for (let i = startIndex + 1; i < dataItems.length; i++) {
    if ((dataItems[i].__level ?? 0) <= level) break
    count++
  }
  return count
}

/** Обработчик клика по стрелке дерева */
const handleTreeCellClick = loadingWrapper(async (row: any) => {
  if (!apiTable) throw new Error('apiTable is undefined')

  const { data: dataItems, findDataItemIndex, createDataItem, deleteDataItems } = apiTable

  const index = findDataItemIndex(row[uniqueKey], uniqueKey)
  if (index === -1) throw new Error(`Item not found. Unique key: ${uniqueKey}`)

  // Если элемент уже открыт, то удаляем все элементы ниже него
  if (row.__isExpanded) {
    const countItemDelete = countItemsAtLevel(index, unref(dataItems), currentLevel)
    const deleteData = deleteDataItems(index + 1, countItemDelete)

    if (isCacheData) cache = deleteData

    row.__isExpanded = false
    return
  }

  // Если элемент открыт, то проверяем кэшированные данные
  if (isCacheData && cache.length > 0) {
    createDataItem(cache, { index: index + 1, isDataArray: true, isCloneData: isCloneData })
    row.__isExpanded = true
    return
  }

  // Если элемент не открыт, то загружаем данные
  const _newData = await onLoadData(row)
  for (const item of _newData) {
    // Сбрасываем флаг __isExpanded для всех элементов
    if (item[expandableKey]) item.__isExpanded = false
    // Устанавливаем уровень вложенности
    item.__level = currentLevel + 1
  }
  createDataItem(_newData, { index: index + 1, isDataArray: true, isCloneData: isCloneData })
  row.__isExpanded = true
})
</script>

<template>
  <span :style="indentStyle" />

  <span class="wrap-icon">
    <vu-icon-svg-slot
      v-if="row[expandableKey]"
      :size="14"
      color="var(--el-text-color-regular)"
    >
      <svg-loading v-if="loading" />

      <svg-arrow-right
        v-else
        :class="{ 'is-expanded': row.__isExpanded }"
        class="expend-icon"
        @click="handleTreeCellClick(row)"
      />
    </vu-icon-svg-slot>
  </span>
</template>

<style>
.virt-table-body {
  .wrap-icon {
    display: flex;
    flex: 0 0 20px;

    user-select: none;
  }

  .expend-icon {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }

  .is-expanded {
    transform: rotate(90deg);
  }
}
</style>
