<script setup lang="ts">
import { TheLoading } from '@vek-element/ui/layout'
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </template>
    <template v-else>
      <the-loading />
    </template>
  </router-view>
</template>
