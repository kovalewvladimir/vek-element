<script setup lang="ts">
import { ElButton, ElCard } from 'element-plus'
import { useLayoutConfigStore } from 'element-plus-aa'

const configLayout = useLayoutConfigStore()
</script>

<template>
  <el-card
    class=":uno: w-full h-full"
    header="Компоненты"
  >
    <el-card>
      <el-button @click="configLayout.menu.setCollapse(!configLayout.menu.collapse)"
        >collapse - {{ configLayout.menu.collapse }}</el-button
      >
    </el-card>
  </el-card>
</template>
