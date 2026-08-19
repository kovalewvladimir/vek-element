<script setup lang="ts">
import { useLayoutConfigStore, useNavigationStore, VuContentWrap } from '@vek-element/ui'
import { ElButton, ElDatePicker, ElDivider, ElInput } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const configLayout = useLayoutConfigStore()
const router = useRouter()
const navigation = useNavigationStore()

const findName = ref<string>('SubMenu1-1')
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>Playground</h2>
    </template>

    <el-divider content-position="left">Навигация (router)</el-divider>
    <div>
      <el-button
        type="primary"
        @click="() => router.push('/not-found/not-found')"
        >not-found</el-button
      >
      <el-button
        type="primary"
        @click="() => router.push('/login')"
        >login</el-button
      >
    </div>

    <el-divider content-position="left">Навигация (store)</el-divider>
    <div class="flex items-center gap-10px">
      <el-input
        v-model="findName"
        class="w-240px"
      />
      <el-button
        type="primary"
        @click="console.log(navigation.getFullPathByName(findName))"
        >getFullPathByName</el-button
      >
      <el-button
        type="primary"
        @click="navigation.navigateToItem(findName)"
        >navigateToItem</el-button
      >
    </div>

    <el-divider content-position="left">Layout config</el-divider>
    <div>
      <el-button @click="configLayout.menu.setCollapse(!configLayout.menu.collapse)"
        >collapse - {{ configLayout.menu.collapse }}</el-button
      >
    </div>

    <el-divider content-position="left">Element Plus date-picker</el-divider>
    <el-date-picker />
  </vu-content-wrap>
</template>
