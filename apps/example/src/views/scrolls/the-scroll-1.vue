<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { ElButton } from 'element-plus'
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h1 class="text-2xl">The Scroll 1</h1>
    </template>
    <div
      class="h-full bg-red-2 overflow-hidden overflow-y-auto"
      style="height: 100%; box-sizing: border-box"
    >
      <div
        v-for="item in 15"
        :key="item"
        class="h-100px bg-red-3 m-10px flex items-center justify-center"
      >
        <el-button>Button</el-button>
      </div>
    </div>
  </vu-content-wrap>
</template>
