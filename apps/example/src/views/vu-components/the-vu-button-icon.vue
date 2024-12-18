<script setup lang="ts">
import { VuButtonIcon, VuButtonIconType, VuContentWrap } from '@vek-element/ui'

const icons: Array<string> = ['el-icon-menu', 'el-logo', 'ep--close']

const types: Array<VuButtonIconType> = [
  'default',
  'success',
  'warning',
  'info',
  'primary',
  'danger'
]
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-button-icon</h2>
    </template>

    <div
      v-for="icon in icons"
      :key="icon"
      class="mb-10px"
    >
      <vu-button-icon
        v-for="type in types"
        :key="type"
        :type="type"
        :icon="icon"
        :tooltip="`Type: ${type}, Icon: ${icon}`"
      />
    </div>
  </vu-content-wrap>
</template>
