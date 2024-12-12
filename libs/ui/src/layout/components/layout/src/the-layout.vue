<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import { useNavigationStore } from '../../../stores'
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
  navigationStore.tagItems.forEach((item) => {
    if (item.route.meta.cache) setComponentNames.add(item.route.name)
  })
  return Array.from(setComponentNames)
})
</script>

<template>
  <div>
    <classic-layout>
      <router-view v-slot="{ Component }">
        <!-- <transition name="el-fade-in-linear"> -->
        <keep-alive
          ref="keepAlive"
          :include="includeKeepAlive"
        >
          <component :is="Component" />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </classic-layout>
  </div>
</template>
