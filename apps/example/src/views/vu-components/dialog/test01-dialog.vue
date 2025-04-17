<script setup lang="ts">
import { VuModalDialog } from '@vek-element/ui'
import { ElButton } from 'element-plus'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

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
  if (!dialog.value) return
  inputData.value = input
  const res = await dialog.value.open()
  console.log('result dialog:', res)
  return res as string
}

function close() {
  dialog.value?.close('close Data')
}

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
    </template>
    <template #footer>
      <el-button @click="close">Close</el-button>
    </template>
  </vu-modal-dialog>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
