<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const input = ref('')
</script>

<template>
  <h1>Sub Menu 1-1</h1>

  <el-input
    v-model="input"
    placeholder="test"
  />
</template>
