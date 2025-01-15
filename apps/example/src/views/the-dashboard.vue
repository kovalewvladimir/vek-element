<script setup lang="ts">
import {
  useLayoutConfigStore,
  useNavigationStore,
  VuAutocompleteRemote,
  VuIconSvgDynamic,
  VuModalDialog,
  type VuModalDialogInstance
} from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElButton, ElCard, ElDatePicker, ElInput } from 'element-plus'
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const configLayout = useLayoutConfigStore()
const router = useRouter()
const navigation = useNavigationStore()

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

const findName = ref<string>('SubMenu1-1')

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

      <div class="mt-10px">
        <el-input v-model="findName" />
        <el-button
          type="primary"
          @click="console.log(navigation.getFullPathByName(findName))"
          >getFullPathByName</el-button
        >
      </div>
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

    <el-card>
      <el-date-picker />
    </el-card>
  </el-card>
</template>
