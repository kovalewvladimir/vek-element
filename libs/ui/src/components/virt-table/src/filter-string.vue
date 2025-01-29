<script setup lang="ts">
import { ElButton, ElInput, ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import { computed, onMounted, type Ref, ref, unref, useTemplateRef } from 'vue'

import { FILTER_TYPE_LABEL } from './constants'
import { type ColumnType, type FilterStringType, type IFilterString } from './types'

const props = defineProps<{ columnType: ColumnType | undefined }>()
const emit = defineEmits<{
  (e: 'createFilter', filter: IFilterString, closeMenu: boolean): void
}>()

const inputValue = useTemplateRef('inputValue')

const type: Ref<FilterStringType> = ref('contains')
const value = ref('')

const isTypeEmpty = computed(() => type.value === 'notnull' || type.value === 'null')

const createFilter = (closeMenu: boolean) => {
  const _value = unref(value).trim()

  if (_value) {
    emit('createFilter', { type: unref(type), value: _value }, closeMenu)
    value.value = ''
  }
  if (isTypeEmpty.value) emit('createFilter', { type: unref(type), value: '' }, closeMenu)
}

onMounted(() => {
  unref(inputValue)?.focus()
})
</script>

<template>
  <div class="flex flex-col">
    <el-select
      v-model="type"
      class="mb5px"
      :teleported="false"
    >
      <el-option-group>
        <el-option
          value="contains"
          :label="FILTER_TYPE_LABEL.contains"
        />
        <el-option
          value="notcontains"
          :label="FILTER_TYPE_LABEL.notcontains"
        />
      </el-option-group>
      <template v-if="props.columnType === 'string'">
        <el-option-group>
          <el-option
            value="eq"
            :label="FILTER_TYPE_LABEL.eq"
          />
          <el-option
            value="ne"
            :label="FILTER_TYPE_LABEL.ne"
          />
        </el-option-group>
        <el-option-group>
          <el-option
            value="null"
            :label="FILTER_TYPE_LABEL.null"
          />
          <el-option
            value="notnull"
            :label="FILTER_TYPE_LABEL.notnull"
          />
        </el-option-group>
      </template>
    </el-select>
    <el-input
      v-if="!isTypeEmpty"
      ref="inputValue"
      v-model="value"
      class="mb5px"
      @keydown.enter.exact="createFilter(true)"
      @keydown.ctrl.enter.exact="createFilter(false)"
    />
    <el-button @click="createFilter(true)">Применить</el-button>
  </div>
</template>
