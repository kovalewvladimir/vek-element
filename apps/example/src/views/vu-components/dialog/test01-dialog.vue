<script setup lang="ts">
import { useLoading } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { VuModalDialog } from '@vek-element/ui-components'
import { ElButton, ElDatePicker } from 'element-plus'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const { loading, loadingWrapper } = useLoading()

// ==================
// Types
// ==================

// Получаем тип параметра функции close
type CloseData = Parameters<typeof close>[0]

// =========================
// Refs
// =========================
const dialog = useTemplateRef('dialog')

// =========================
// Data
// =========================

const title = ref('Vu Modal Dialog')
const inputData = ref('')

// =========================
// LifeCycle
// =========================

onMounted(() => {
  console.log('test01-dialog mounted')
})
onUnmounted(() => {
  console.log('test01-dialog unmounted')
})

// =========================
// Methods
// =========================

async function open(input: string) {
  if (!dialog.value) throw new Error('Dialog is not defined')
  inputData.value = input
  return (await dialog.value.open()) as CloseData
}

function close(data: string) {
  dialog.value?.close(data)
}

const error = loadingWrapper(async () => {
  await asyncSleep(2000)
  throw new Error('Error')
})

// =========================
// Expose
// =========================

defineExpose({ open })
</script>

<template>
  <vu-modal-dialog ref="dialog">
    <template #default>
      <h1>{{ title }}</h1>
      <h2>{{ inputData }}</h2>

      <el-date-picker />
    </template>
    <template #footer>
      <el-button
        v-loading="loading"
        @click="error"
        >Error</el-button
      >
      <el-button @click="close('close dialog')">Close</el-button>
    </template>
  </vu-modal-dialog>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
