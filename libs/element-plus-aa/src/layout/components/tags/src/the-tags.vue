<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import { useTemplateRef } from 'vue'

import { useNavigationStore } from '../../../stores/navigateStore'
import TagButton from './tag-button.vue'

const navigationStore = useNavigationStore()

const scrollRef = useTemplateRef<InstanceType<typeof ElScrollbar>>('scrollRef')

const wheelEvent = (e: WheelEvent) => {
  const scrollLeft = scrollRef.value?.wrapRef?.scrollLeft ?? 0
  scrollRef.value?.setScrollLeft(scrollLeft + e.deltaY)
}
</script>

<template>
  <el-scrollbar
    ref="scrollRef"
    class=":uno: pr-10px pl-10px"
    view-style="height: 100%;"
    @wheel="wheelEvent"
  >
    <div class=":uno: h-full flex items-center">
      <div class=":uno: flex">
        <tag-button
          v-for="(tag, index) in navigationStore.tagItems"
          :key="index"
          :tag="tag"
        />
      </div>
    </div>
  </el-scrollbar>
</template>
