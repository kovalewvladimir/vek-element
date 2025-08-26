<script setup lang="ts">
import { useModalDialog } from '@vek-element/ui-components'
import { ElButton, ElCard } from 'element-plus'
import { getCurrentInstance } from 'vue'

import test01Dialog from './test01-dialog.vue'

// =========================
// Data
// =========================

const currentInstance = getCurrentInstance()

// =========================
// Composition API
// =========================

const { open: openDialog } = useModalDialog(test01Dialog, currentInstance)

// =========================
// Methods
// =========================

async function open() {
  const res = await openDialog('123')
  console.log('result dialog:', res)
}
</script>

<template>
  <el-card>
    <el-button @click="open">Open modal dialog</el-button>
  </el-card>
</template>
