<script setup lang="ts">
import { VuIconSvgDynamic } from '@vek-element/ui-components'
import { ElButton, ElTooltip } from 'element-plus'

import { type VuButtonIconType } from './types'

const {
  icon,
  type = 'default',
  tooltip = '',
  tooltipShowAfter = 500
} = defineProps<{
  /** Имя иконки */
  icon: string

  /**
   * Тип кнопки
   *
   * По умолчанию: `default`
   * */
  type?: VuButtonIconType

  /**
   * Текст подсказки
   *
   * По умолчанию: `''`
   * */
  tooltip?: string

  /**
   * Время перед показом подсказки ms
   *
   * По умолчанию: `500` ms
   * */
  tooltipShowAfter?: number
}>()
</script>

<template>
  <el-tooltip
    :disabled="tooltip === ''"
    :show-after="tooltipShowAfter"
    :content="tooltip"
    placement="top"
  >
    <el-button
      v-bind="$attrs"
      :type="type"
    >
      <template
        v-if="$slots.default"
        #default
      >
        <slot />
      </template>
      <template #icon>
        <vu-icon-svg-dynamic
          :name="icon"
          :size="18"
        />
      </template>
    </el-button>
  </el-tooltip>
</template>
