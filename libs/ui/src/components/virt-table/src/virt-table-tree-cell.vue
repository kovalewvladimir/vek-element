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
  /** Величина отступа для уровня вложенности в пикселях (по умолчанию 20) */
  levelIndent?: number
}>()

// ==================
// Variables
// ==================

const currentLevel: number = row.__level ?? 0

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

  if (row.__isExpanded) {
    const countItemDelete = countItemsAtLevel(index, unref(dataItems), currentLevel)
    deleteDataItems(index + 1, countItemDelete)
  } else {
    const _newData = await onLoadData(row)
    for (const item of _newData) item.__level = currentLevel + 1
    createDataItem(_newData, { index: index + 1, isDataArray: true })
  }

  row.__isExpanded = !row.__isExpanded
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
