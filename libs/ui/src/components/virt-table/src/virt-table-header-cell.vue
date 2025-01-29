<script setup lang="ts">
import { VuIconSvgDynamic } from '@vek-element/ui'
import { computed, type PropType } from 'vue'

import { type Column } from './types'

const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    required: true
  }
})

const iconName = computed<string | null>(() => {
  const isFilter = props.column.filters.length > 0
  const isASC = props.column.sort === 'ASC'
  const isDESC = props.column.sort === 'DESC'

  if (isFilter && isASC) return 'fluent-mdl2/filter-ascending'
  if (isFilter && isDESC) return 'fluent-mdl2/filter-descending'
  if (isFilter) return 'fluent-mdl2/filter'
  if (isASC) return 'fluent-mdl2/sort-up'
  if (isDESC) return 'fluent-mdl2/sort-down'

  return null
})
</script>

<template>
  <slot :column="column">
    <div
      class="text grow-1"
      :class="{ 'c-blue': iconName, 'cursor-pointer': column.menu }"
      >{{ column.label }}</div
    >
    <div>
      <vu-icon-svg-dynamic
        v-if="iconName"
        :name="iconName"
        :size="16"
        color="#60A5FA"
      />
    </div>
  </slot>
</template>
