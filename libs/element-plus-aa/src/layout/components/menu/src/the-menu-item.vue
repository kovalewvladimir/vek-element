<script setup lang="ts">
import { ElMenuItem, ElSubMenu } from 'element-plus'

import { ElaIconSvgDynamic } from '../../../../components/icon-svg'
import type { MenuItem } from '../../../stores/types'

const { menuItem, rootIndex } = defineProps<{
  rootIndex: string
  menuItem: MenuItem
}>()
</script>

<template>
  <template v-if="menuItem.children">
    <el-sub-menu :index="rootIndex">
      <template #title>
        <ela-icon-svg-dynamic :name="menuItem.meta.icon" />
        <span>{{ menuItem.meta.title }}</span>
      </template>
      <the-menu-item
        v-for="(item, index) in menuItem.children"
        :key="index"
        :root-index="`${rootIndex}-${index}`"
        :menu-item="item"
      />
    </el-sub-menu>
  </template>

  <template v-else>
    <el-menu-item :index="rootIndex">
      <ela-icon-svg-dynamic :name="menuItem.meta.icon" />
      <span>{{ menuItem.meta.title }}</span>
    </el-menu-item>
  </template>
</template>
