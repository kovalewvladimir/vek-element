<script setup lang="ts">
import { useNavigationStore } from '@vek-element/ui'
import { RouterView } from 'vue-router'

import ClassicLayout from './classic-layout.vue'

const { cachedComponentNameList } = useNavigationStore()

/* 
// Список компонентов, которые кэшируются
const keepAlive = useTemplateRef('keepAlive')
function logCachedComponents() {
  // @ts-expect-error __v_cache is private
  console.log(keepAlive.value.$?.__v_cache)
}
*/
</script>

<template>
  <classic-layout>
    <router-view v-slot="{ Component }">
      <!-- <transition name="el-fade-in-linear"> -->
      <keep-alive :include="cachedComponentNameList">
        <component :is="Component" />
      </keep-alive>
      <!-- </transition> -->
    </router-view>
  </classic-layout>
</template>
