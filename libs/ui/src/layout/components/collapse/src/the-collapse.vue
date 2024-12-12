<script setup lang="ts">
import {
  AntDesignMenuFoldOutlined,
  AntDesignMenuUnfoldOutlined,
  VuIconSvgSlot
} from '../../../../components/icon-svg'
import { useLayoutConfigStore } from '../../../stores'

const configLayout = useLayoutConfigStore()
</script>

<template>
  <div
    class="flex items-center h-full pl-10px pr-10px"
    @click="configLayout.menu.setCollapse(!configLayout.menu.collapse)"
  >
    <vu-icon-svg-slot :size="18">
      <ant-design-menu-unfold-outlined v-if="configLayout.menu.collapse" />
      <ant-design-menu-fold-outlined v-else />
    </vu-icon-svg-slot>
  </div>
</template>
