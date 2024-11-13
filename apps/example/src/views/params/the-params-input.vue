<script setup lang="ts">
import { ElCard, ElInput } from 'element-plus'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const inputTest = ref(route.params.id as string)
</script>

<template>
  <el-card
    class=":uno: w-full h-full"
    header="test"
  >
    <el-card>
      {{ route.params }}

      <el-input v-model="inputTest" />
    </el-card>
  </el-card>
</template>
