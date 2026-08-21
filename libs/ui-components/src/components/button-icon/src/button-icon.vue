<script setup lang="ts">
import { ElTooltip } from 'element-plus'

import ButtonIconBase from './button-icon-base.vue'
import { type IVuButtonIconProps } from './types'

defineOptions({ inheritAttrs: false })

const {
  icon,
  iconSize = 18,

  type = 'default',
  text = false,
  bg = false,
  link = false,
  disabled = false,

  tooltip = '',
  tooltipShowAfter = 500
} = defineProps<IVuButtonIconProps>()
</script>

<template>
  <!--
    Без подсказки компонент рендерит один корневой элемент (el-button),
    поэтому его можно передавать в #reference у el-popconfirm и других попперов.
    el-tooltip рендерит фрагмент и такой сценарий ломает
  -->
  <el-tooltip
    v-if="tooltip !== ''"
    :show-after="tooltipShowAfter"
    :content="tooltip"
    placement="top"
  >
    <button-icon-base
      v-bind="$attrs"
      :icon="icon"
      :icon-size="iconSize"
      :type="type"
      :text="text"
      :bg="bg"
      :link="link"
      :disabled="disabled"
    >
      <template
        v-if="$slots.default"
        #default
      >
        <slot />
      </template>
    </button-icon-base>
  </el-tooltip>

  <button-icon-base
    v-else
    v-bind="$attrs"
    :icon="icon"
    :icon-size="iconSize"
    :type="type"
    :text="text"
    :bg="bg"
    :link="link"
    :disabled="disabled"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </button-icon-base>
</template>
