<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<template>
  <div class="h-full p-10px">
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
  </div>
</template>
