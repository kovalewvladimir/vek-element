<script setup lang="ts">
import { useLayoutConfigStore } from '@vek-element/ui'
import { ElButton, ElCard } from 'element-plus'
import { RouterLink } from 'vue-router'

const configLayout = useLayoutConfigStore()
</script>

<template>
  <el-card
    class="w-full h-full"
    header="Компоненты"
  >
    <el-card>
      <el-button @click="configLayout.menu.setCollapse(!configLayout.menu.collapse)"
        >collapse - {{ configLayout.menu.collapse }}</el-button
      >
      <router-link
        v-for="i in 10"
        :key="i"
        :to="`/params/original/${i}`"
        ><el-button text>test{{ i }}</el-button></router-link
      >
    </el-card>
  </el-card>
</template>
