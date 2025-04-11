<script setup lang="ts">
import { VuIconSvgSlot } from '@vek-element/ui'
import { computed } from 'vue'

import { SvgArrowRight, SvgLoading } from './svgs'
import { getMetaData } from './utils'

// ==================
// Props
// ==================

const {
  row,
  expandableKey,
  levelIndent = 20
} = defineProps<{
  /** Данные строки */
  row: any

  /** Ключ строки по которому определяем, что строка может быть раскрыта */
  expandableKey: string

  /** Величина отступа для уровня вложенности в пикселях (по умолчанию 20) */
  levelIndent?: number
}>()

// ==================
// Variables
// ==================

const currentLevel: number = getMetaData(row)?.tree?.level ?? 0

// ==================
// Computed
// ==================

const indentStyle = computed(() => ({
  flex: `0 0 ${levelIndent * currentLevel}px`
}))

const isExpandable = computed(() => row[expandableKey])
const isLoading = computed(() => getMetaData(row)?.tree?.isLoading ?? false)
const isOpen = computed(() => getMetaData(row)?.tree?.isOpen ?? false)

// ==================
// Emits
// ==================

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <span :style="indentStyle" />

  <span class="wrap-icon">
    <vu-icon-svg-slot
      v-if="isExpandable"
      :size="14"
      color="var(--el-text-color-regular)"
    >
      <svg-loading v-if="isLoading" />

      <svg-arrow-right
        v-else
        :class="{ 'is-open': isOpen }"
        class="expend-icon"
        @click.stop="emit('click', $event)"
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

  .is-open {
    transform: rotate(90deg);
  }
}
</style>
