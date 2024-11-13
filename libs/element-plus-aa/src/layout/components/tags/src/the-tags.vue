<script setup lang="ts">
import { useNavigationStore } from '../../../stores/navigateStore'
import TagButton from './tag-button.vue'

const navigationStore = useNavigationStore()
</script>

<template>
  <div class=":uno: h-full flex items-center">
    <div class=":uno: flex-1 pr-10px pl-10px">
      <div class=":uno: flex">
        <tag-button
          v-for="(tag, index) in navigationStore.tagItems"
          :key="index"
          :tag="tag"
        />
      </div>
    </div>
  </div>
</template>
