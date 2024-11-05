<script setup lang="ts">
import { ElButton, ElCard } from 'element-plus'
import {
  ElaAutocompleteRemote,
  ElaIconSvgDynamic,
  ElaLayout,
  ElaModalDialog,
  ElaModalDialogInstance
} from 'element-plus-aa'
// import { asyncSleep } from 'element-plus-aa/utils'
import { ref, useTemplateRef } from 'vue'

const autocompleteValue = ref<string>('')

const getOptions = async () => {
  // await asyncSleep(3000);
  return {
    data: [
      { value: 'Test1', label: 'Test1' },
      { value: 'Test2', label: 'Test2' },
      { value: 'Test3', label: 'Test3' }
    ]
  }
}

const dialogRef = useTemplateRef<ElaModalDialogInstance>('dialogRef')
</script>

<template>
  <ela-layout>
    <el-card
      class=":uno: w-full h-full"
      header="Компоненты"
    >
      <el-card
        header="ela-autocomplete-remote"
        class=":uno: h-full"
      >
        <ela-autocomplete-remote
          v-model="autocompleteValue"
          :get-loading-options="getOptions"
        />

        <ela-icon-svg-dynamic
          name="ep--close"
          hover-color="green"
          color="red"
        />
      </el-card>
      <el-card>
        <el-button @click="() => dialogRef?.open()">Open modal dialog</el-button>
        <ela-modal-dialog ref="dialogRef">
          <template #default>
            <h1>Test ela-modal-dialog</h1>
          </template>
          <template #footer>
            <el-button @click="() => dialogRef?.close()">Close</el-button>
          </template>
        </ela-modal-dialog>
      </el-card>
    </el-card>
  </ela-layout>
</template>
