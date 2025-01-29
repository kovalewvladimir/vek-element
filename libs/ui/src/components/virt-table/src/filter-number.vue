<script setup lang="ts">
import { ElButton, ElInput, ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import { computed, onMounted, type Ref, ref, unref, useTemplateRef } from 'vue'

import { FILTER_TYPE_LABEL } from './constants'
import { type FilterNumberType, type IFilterNumber } from './types'

const emit = defineEmits<{
  (e: 'createFilter', filter: IFilterNumber, closeMenu: boolean): void
}>()

const inputValue = useTemplateRef('inputValue')

const type: Ref<FilterNumberType> = ref('eq')
const value = ref<string | null>(null)

const isTypeEmpty = computed(() => type.value === 'notnull' || type.value === 'null')

const createFilter = (closeMenu: boolean) => {
  const _value = unref(value)

  if (_value) {
    emit('createFilter', { type: unref(type), value: Number.parseFloat(_value) }, closeMenu)
    value.value = null
  }
  if (isTypeEmpty.value) emit('createFilter', { type: unref(type), value: 0 }, closeMenu)
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
          value="gt"
          :label="FILTER_TYPE_LABEL.gt"
        />
        <el-option
          value="lt"
          :label="FILTER_TYPE_LABEL.lt"
        />
      </el-option-group>
      <el-option-group>
        <el-option
          value="ge"
          :label="FILTER_TYPE_LABEL.ge"
        />
        <el-option
          value="le"
          :label="FILTER_TYPE_LABEL.le"
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
    </el-select>
    <el-input
      v-if="!isTypeEmpty"
      ref="inputValue"
      v-model="value"
      type="number"
      class="mb5px"
      @keydown.enter.exact="createFilter(true)"
      @keydown.ctrl.enter.exact="createFilter(false)"
    />
    <el-button @click="createFilter(true)">Применить</el-button>
  </div>
</template>
