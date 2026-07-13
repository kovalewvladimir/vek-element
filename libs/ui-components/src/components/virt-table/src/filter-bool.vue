<script setup lang="ts">
import { ElButton, ElOption, ElOptionGroup, ElRadioButton, ElRadioGroup, ElSelect } from 'element-plus'
import { computed, type Ref, ref, unref } from 'vue'

import { FILTER_TYPE_LABEL } from './constants'
import { type FilterBoolType, type IFilterBool } from './types'

const emit = defineEmits<{
  (e: 'createFilter', filter: IFilterBool, closeMenu: boolean): void
}>()

const type: Ref<FilterBoolType> = ref('eq')
const value = ref(true)

const isTypeEmpty = computed(() => type.value === 'notnull' || type.value === 'null')

const createFilter = (closeMenu: boolean) => {
  emit('createFilter', { type: unref(type), value: unref(value) }, closeMenu)
}
</script>

<template>
  <div class="flex flex-col w150px">
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
          value="null"
          :label="FILTER_TYPE_LABEL.null"
        />
        <el-option
          value="notnull"
          :label="FILTER_TYPE_LABEL.notnull"
        />
      </el-option-group>
    </el-select>

    <el-radio-group
      v-if="!isTypeEmpty"
      v-model="value"
      class="mb5px"
    >
      <el-radio-button :value="true">Да</el-radio-button>
      <el-radio-button :value="false">Нет</el-radio-button>
    </el-radio-group>

    <el-button @click="createFilter(true)">Применить</el-button>
  </div>
</template>
