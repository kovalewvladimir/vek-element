<script setup lang="ts">
import { ElCard, ElInput } from 'element-plus'
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const _id = route.params.id as string

const inputTest = ref(_id)

const random = Math.random().toPrecision(4)

onMounted(() => {
  console.log(`onMounted - ${_id} (random: ${random})`)
})

onUnmounted(() => {
  console.log(`onUnmounted - ${_id} (random: ${random})`)
})

onActivated(() => {
  console.log(`onActivated - ${_id} (random: ${random})`)
})

onDeactivated(() => {
  console.log(`onDeactivated - ${_id} (random: ${random})`)
})
</script>

<template>
  <el-card>
    <template #header>
      <h1>Params - {{ _id }}</h1>
    </template>
    <el-input v-model="inputTest" />
  </el-card>
</template>
