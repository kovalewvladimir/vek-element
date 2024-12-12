<script setup lang="ts">
import { RouterView } from 'vue-router'

import { TheLoading } from '../../loading'
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
