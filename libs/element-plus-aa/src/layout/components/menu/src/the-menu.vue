<script setup lang="ts">
import { ElMenu } from 'element-plus'

import { useLayoutConfigStore } from '../../../stores/layoutConfigStore'
import TheMenuItem from './the-menu-item.vue'

const config = useLayoutConfigStore()
</script>

<template>
  <el-menu :collapse="config.menu.collapse">
    <the-menu-item
      v-for="(item, index) in config.menu.items"
      :key="index"
      :root-index="index.toString()"
      :menu-item="item"
    />
  </el-menu>
</template>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
