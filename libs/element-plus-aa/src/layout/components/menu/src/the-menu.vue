<script setup lang="ts">
import { ElMenu } from 'element-plus'
import { toValue } from 'vue'

import { useLayoutConfigStore } from '../../../stores/layoutConfigStore'
import { useNavigationStore } from '../../../stores/navigateStore'
import TheMenuItem from './the-menu-item.vue'

const config = useLayoutConfigStore()
const navigationStore = useNavigationStore()
</script>

<template>
  <el-menu
    :collapse="config.menu.collapse"
    :default-active="toValue(navigationStore.menuActive)"
  >
    <the-menu-item
      v-for="(item, index) in navigationStore.menuItems"
      :key="index"
      :menu-item="item"
    />
  </el-menu>
</template>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
