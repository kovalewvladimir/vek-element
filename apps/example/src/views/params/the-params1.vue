<script setup lang="ts">
import { ElButton, ElCard } from 'element-plus'
import { useLayoutConfigStore } from 'element-plus-aa'
import { RouterLink } from 'vue-router'

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
      <router-link
        v-for="i in 10"
        :key="i"
        :to="`/params/two/${i}`"
        ><el-button text>{{ `/params/two/${i}` }}</el-button></router-link
      >
    </el-card>
  </el-card>
</template>
