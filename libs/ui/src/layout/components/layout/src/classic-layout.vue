<script setup lang="ts">
import { useLayoutConfigStore } from '@vek-element/ui'
import {
  TheBreadcrumb,
  TheCollapse,
  TheLogo,
  TheMenu,
  TheTags,
  UserInfo
} from '@vek-element/ui/layout'
import { computed } from 'vue'

const config = useLayoutConfigStore()

const widthLeft = computed(() => (config.menu.collapse ? '65px' : '200px'))
</script>

<template>
  <div class="layoutContainer">
    <div class="logo">
      <the-logo />
    </div>
    <div class="menu">
      <the-menu />
    </div>
    <div class="header">
      <div class="h-full flex items-center justify-between">
        <div class="h-full flex items-center">
          <the-collapse />
          <the-breadcrumb />
        </div>
        <div class="h-full flex items-center">
          <user-info />
        </div>
      </div>
    </div>
    <div class="tags">
      <the-tags />
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layoutContainer {
  min-width: 800px;

  height: 100vh;

  display: grid;
  grid-template-columns: v-bind(widthLeft) 1fr;
  grid-template-rows: 50px 35px 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    'logo header'
    'logo tags'
    'menu main';

  /* Добавляем переход */
  transition: grid-template-columns 0.3s ease;
}

.logo {
  grid-area: logo;

  font-weight: bold;
  color: var(--menu-color);
  background-color: var(--menu-bg-color);
}

.menu {
  grid-area: menu;

  overflow: auto;

  background-color: var(--menu-bg-color);
}

.header {
  grid-area: header;
}

.tags {
  grid-area: tags;

  overflow: auto;

  position: relative;
}

.tags::before {
  --border: 1px solid var(--el-border-color);

  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: var(--border);
  border-bottom: var(--border);
  pointer-events: none; /* Чтобы граница не блокировала взаимодействие с контентом */
  box-sizing: border-box;
}

.main {
  grid-area: main;

  overflow: auto;

  padding: 10px;

  background-color: #f5f7f9;
}
</style>
