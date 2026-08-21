<script setup lang="ts">
import { VuIconSvgDynamic } from '@vek-element/ui-components'
import { ElButton } from 'element-plus'

import { type IVuButtonIconBaseProps } from './types'

const {
  icon,
  iconSize = 18,

  type = 'default',
  text = false,
  bg = false,
  link = false,
  disabled = false
} = defineProps<IVuButtonIconBaseProps>()
</script>

<template>
  <el-button
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
    <template #icon>
      <vu-icon-svg-dynamic
        :name="icon"
        :size="iconSize"
      />
    </template>
  </el-button>
</template>
