<script setup lang="ts">
import { VuAutocompleteRemote, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElButton, ElDivider } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

const autocompleteValue = ref<string>('')
const autocompleteRef = useTemplateRef('autocompleteRef')

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

const getOption = () => {
  return autocompleteRef.value?.getOption()
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-autocomplete-remote</h2>
    </template>

    <el-divider content-position="left">Загрузка опций с задержкой 3с</el-divider>

    <vu-autocomplete-remote
      ref="autocompleteRef"
      v-model="autocompleteValue"
      :get-loading-options="getOptions"
    />

    <div class="mt-10px">
      <el-button
        type="primary"
        @click="() => console.log(getOption())"
        >getOption</el-button
      >
    </div>
  </vu-content-wrap>
</template>
