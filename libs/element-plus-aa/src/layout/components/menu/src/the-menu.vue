<script setup lang="ts">
import { ElMenu, ElScrollbar } from 'element-plus'
import { toValue } from 'vue'

import { useLayoutConfigStore } from '../../../stores/layoutConfig'
import { useNavigationStore } from '../../../stores/navigate'
import TheMenuItem from './the-menu-item.vue'

const config = useLayoutConfigStore()
const navigationStore = useNavigationStore()
</script>

<template>
  <el-scrollbar>
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
  </el-scrollbar>
</template>

<style scoped>
.el-menu {
  border-right: none;

  --el-menu-text-color: var(--menu-color);
  --el-menu-bg-color: var(--menu-bg-color);
}

/** Первый уровень меню */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  color: var(--menu-hover-color);
  background-color: var(--menu-hover-bg-color);
}

/** Второй и последующие уровни меню */
:deep(.el-menu--inline) {
  background-color: var(--submenu-bg-color);
}
:deep(.el-menu--inline .el-sub-menu__title:hover),
:deep(.el-menu--inline .el-menu-item:not(.is-active):hover) {
  color: var(--menu-hover-color);
  background-color: var(--submenu-hover-bg-color);
}

/** Активный пункт меню */
:deep(.el-menu-item.is-active) {
  color: var(--menu-active-color);
  background-color: var(--menu-active-bg-color);
}
</style>
