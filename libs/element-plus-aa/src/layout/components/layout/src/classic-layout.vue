<script setup lang="ts">
import { TheLogo } from '../../logo'
import { TheMenu } from '../../menu'
</script>

<template>
  <!-- eslint-disable unocss/enforce-class-compile -->
  <div class="layoutContainer">
    <div class="menu-left">
      <the-logo />
      <the-menu />
    </div>
    <div class="header" />
    <div class="tags" />
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
  grid-template-columns: 200px 1fr;
  grid-template-rows: 50px 35px 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    'menu-left header'
    'menu-left tags'
    'menu-left main';
}

.menu-left {
  grid-area: menu-left;
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
