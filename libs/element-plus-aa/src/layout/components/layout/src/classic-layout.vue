<script setup lang="ts">
import { computed } from 'vue'

import { useLayoutConfigStore } from '../../../stores'
import { TheLogo } from '../../logo'
import { TheMenu } from '../../menu'
import { TheTags } from '../../tags'

const config = useLayoutConfigStore()

const widthLeft = computed(() => (config.menu.collapse ? '65px' : '200px'))
</script>

<template>
  <!-- eslint-disable unocss/enforce-class-compile -->
  <div class="layoutContainer">
    <div class="logo">
      <the-logo />
    </div>
    <div class="menu">
      <the-menu />
    </div>
    <div class="header" />
    <div class="tags">
      <the-tags />
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
}

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
    'menu tags'
    'menu main';

  /* Добавляем переход */
  transition: grid-template-columns 0.3s ease;
}

.logo {
  grid-area: logo;

  background-color: var(--menu-bg-color);
}

.menu {
  grid-area: menu;

  background-color: var(--menu-bg-color);
}

.header {
  grid-area: header;
}

.tags {
  grid-area: tags;
}

.main {
  grid-area: main;
  padding: 10px;
}

/* For presentation only, no need to copy the code below */
.layoutContainer > * {
  border: 1px solid red;
}
</style>
