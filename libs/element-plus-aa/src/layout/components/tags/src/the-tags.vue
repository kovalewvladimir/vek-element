<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'

import { useNavigationStore } from '../../../stores/navigateStore'

const navigationStore = useNavigationStore()
const router = useRouter()
</script>

<template>
  <el-button
    v-for="(tag, index) in navigationStore.tags"
    :key="index"
    text
    @click="router.push(tag.path)"
    >{{ tag.title }}</el-button
  >
</template>
