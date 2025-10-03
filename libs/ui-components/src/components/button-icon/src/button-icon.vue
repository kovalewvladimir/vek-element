<script setup lang="ts">
import { VuIconSvgDynamic } from '@vek-element/ui-components'
import { ElButton, ElTooltip } from 'element-plus'

import { type VuButtonIconType } from './types'

const {
  icon,
  type = 'default',

  text = false,
  bg = false,
  link = false,

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
   * Определяет, является ли кнопка текстовой
   * По умолчанию: false
   */
  text?: boolean

  /**
   * Определяет, всегда ли включён фон для текстовой кнопки
   * По умолчанию: false
   */
  bg?: boolean

  /**
   * Определяет, является ли кнопка ссылкой
   * По умолчанию: false
   */
  link?: boolean

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
      :text="text"
      :bg="bg"
      :link="link"
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
