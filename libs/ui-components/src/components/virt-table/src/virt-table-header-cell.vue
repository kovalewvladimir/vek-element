<script setup lang="ts">
import { VuIconSvgSlot } from '@vek-element/ui-components'
import { computed } from 'vue'

import { type Column } from './column'
import { SvgFilter, SvgFilterAscending, SvgFilterDescending, SvgSortDown, SvgSortUp } from './svgs'

const { column } = defineProps<{ column: Column }>()

const icon = computed<string | null>(() => {
  const isFilter = column.filters.length > 0
  const isASC = column.sort === 'ASC'
  const isDESC = column.sort === 'DESC'

  if (isFilter && isASC) return 'filter-ascending'
  if (isFilter && isDESC) return 'filter-descending'
  if (isFilter) return 'filter'
  if (isASC) return 'sort-up'
  if (isDESC) return 'sort-down'

  return null
})
</script>

<template>
  <slot :column="column">
    <div
      class="text grow-1"
      :class="{ 'c-blue': icon, 'cursor-pointer': column.menu }"
      >{{ column.label }}</div
    >
    <div>
      <vu-icon-svg-slot
        :size="16"
        color="#60A5FA"
      >
        <svg-filter-ascending v-if="icon === 'filter-ascending'" />
        <svg-filter-descending v-if="icon === 'filter-descending'" />
        <svg-filter v-if="icon === 'filter'" />
        <svg-sort-up v-if="icon === 'sort-up'" />
        <svg-sort-down v-if="icon === 'sort-down'" />
      </vu-icon-svg-slot>
    </div>
  </slot>
</template>
