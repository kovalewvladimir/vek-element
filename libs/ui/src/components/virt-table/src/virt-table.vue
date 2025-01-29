<script setup lang="ts">
import { ElEmpty, ElTooltip } from 'element-plus'
import { computed, onActivated, type PropType, useTemplateRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { COLUMN_MIN_WIDTH } from './constants'
import { type Column, Columns, type onLoadDataType } from './types'
import { useScrollPosition } from './use-scroll-position'
import { useTooltip } from './use-tooltip'
import { useVirtualData } from './use-virtual-data'
import VirtTableHeaderCell from './virt-table-header-cell.vue'
import VirtTableMenu from './virt-table-menu.vue'
import VirtTableRow from './virt-table-row.vue'

const props = defineProps({
  /**
   * Список колонок для отображения в таблице (обязательный параметр).
   */
  columns: {
    type: Columns,
    required: true
  },
  /**
   * Функция, которая вызывается при загрузке данных (обязательный параметр).
   */
  onLoadData: {
    type: Function as PropType<onLoadDataType>,
    required: true
  },
  /**
   * Кол-во строк в одной странице
   */
  sizePage: {
    type: Number,
    default: 100
  },

  /**
   * Высота таблицы (по умолчанию '300px').
   */
  height: {
    type: String,
    default: '300px'
  },
  /**
   * Высота строки таблицы (по умолчанию 28).
   */
  rowHeight: {
    type: Number,
    default: 28
  },

  /**
   * Количество "лишних" элементов виртуального списка (по умолчанию 10).
   */
  virtualListOverscan: {
    type: Number,
    default: 10
  },
  /**
   * Расстояние до нижней части таблицы, когда начинается бесконечная прокрутка (по умолчанию 10)
   */
  infiniteScrollDistance: {
    type: Number,
    default: 10
  },

  /**
   * Задержка перед показом всплывающей подсказки (по умолчанию 500 миллисекунд).
   */
  tooltipShowDelay: {
    type: Number,
    default: 500
  }
})

// Восстановление позиции scroll при переходе по страницам
onActivated(() => {
  restoreScrollPosition()
})
onBeforeRouteLeave(() => {
  saveScrollPosition()
})

// computed
const rowHeight = computed(() => `${props.rowHeight}px`)
const headerHeight = computed(() => `${props.rowHeight + 6}px`)
const columnMinWidth = computed(() => `${COLUMN_MIN_WIDTH}px`)

// Виртуальный список & Загрузка новых данных при scroll`е
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
  props.onLoadData,
  props.columns,
  props.sizePage,
  props.rowHeight,
  props.virtualListOverscan,
  props.infiniteScrollDistance
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
} = useTooltip(props.tooltipShowDelay)

// Контекстное меню
const virtTableMenuRef = useTemplateRef('virtTableMenuRef')
const onShowContextMenu = (e: MouseEvent, column: Column) => {
  if (column.menu) virtTableMenuRef.value?.onShowContextMenu(e, column)
}
const onSortColumn = (_e: MouseEvent, column: Column) => {
  if (column.menu) {
    const sort = column.sort
    props.columns.setSort(column, sort === 'ASC' ? 'DESC' : 'ASC')
    void reloadData()
  }
}

// Expose
defineExpose({ reloadData, data })
</script>

<template>
  <div
    v-loading="loading"
    v-bind="$attrs"
    class="relative"
    :style="`height: ${props.height}`"
  >
    <div
      v-bind="virtualContainerProps"
      class="virt-table-body h-full"
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
          v-for="{ index, data: row } in virtualData"
          :key="index"
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
                  :name="column.prop"
                  :column="column"
                  :row="row"
                  >{{ column.formatter ? row[`_${column.prop}`] : row[column.prop] }}</slot
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
  overflow-y: scroll;
  border: var(--table-border);

  & .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - v-bind('headerHeight'));

    font-size: 24px;
  }

  & .header {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 2;

    color: var(--el-text-color-secondary);
    font-weight: 600;

    & .cell {
      height: v-bind('headerHeight');
      /* line-height: v-bind('headerHeight'); */

      background: var(--table-header-bg-color);
    }
  }

  & .row {
    display: flex;
  }

  & .cell {
    flex: 1 1 0%;
    min-width: v-bind('columnMinWidth');

    display: flex;
    align-items: center;

    height: v-bind('rowHeight');
    /* line-height: v-bind('rowHeight'); */
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
