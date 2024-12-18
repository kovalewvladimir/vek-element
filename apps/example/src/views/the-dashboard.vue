<script setup lang="ts">
import {
  useLayoutConfigStore,
  VuAutocompleteRemote,
  VuIconSvgDynamic,
  VuModalDialog,
  type VuModalDialogInstance
} from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElButton, ElCard } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

const configLayout = useLayoutConfigStore()

const autocompleteValue = ref<string>('')

const getOptions = async () => {
  await asyncSleep(3000)
  return {
    data: [
      { value: 'Test1', label: 'Test1' },
      { value: 'Test2', label: 'Test2' },
      { value: 'Test3', label: 'Test3' }
    ]
  }
}

const dialogRef = useTemplateRef<VuModalDialogInstance>('dialogRef')
</script>

<template>
  <el-card
    class="w-full h-full"
    header="Компоненты"
  >
    <el-card
      header="vu-autocomplete-remote"
      class="h-full"
    >
      <vu-autocomplete-remote
        v-model="autocompleteValue"
        :get-loading-options="getOptions"
      />

      <vu-icon-svg-dynamic
        name="ep--close"
        hover-color="green"
        color="red"
      />
    </el-card>
    <el-card>
      <el-button @click="() => dialogRef?.open()">Open modal dialog</el-button>
      <vu-modal-dialog ref="dialogRef">
        <template #default>
          <h1>Test vu-modal-dialog</h1>
        </template>
        <template #footer>
          <el-button @click="() => dialogRef?.close()">Close</el-button>
        </template>
      </vu-modal-dialog>
    </el-card>

    <el-card>
      <el-button @click="configLayout.menu.setCollapse(!configLayout.menu.collapse)"
        >collapse - {{ configLayout.menu.collapse }}</el-button
      >
    </el-card>
  </el-card>
</template>
