<script setup lang="ts">
import { useNavigationStore } from '@vek-element/ui'
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import ClassicLayout from './classic-layout.vue'

const navigationStore = useNavigationStore()

/* 
// Список компонентов, которые кэшируются
const keepAlive = useTemplateRef('keepAlive')
function logCachedComponents() {
  // @ts-expect-error __v_cache is private
  console.log(keepAlive.value.$?.__v_cache)
}
*/

const includeKeepAlive = computed(() => {
  const setComponentNames = new Set<string>()
  for (const item of navigationStore.tagItems) {
    if (item.route.meta.cache) setComponentNames.add(item.route.name)
  }
  return [...setComponentNames]
})
</script>

<template>
  <div>
    <classic-layout>
      <router-view v-slot="{ Component }">
        <!-- <transition name="el-fade-in-linear"> -->
        <keep-alive :include="includeKeepAlive">
          <component :is="Component" />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </classic-layout>
  </div>
</template>
