<script setup lang="ts">
import { dateToBackendFormat, getCapitalizedMonth } from '@vek-element/ui-components/utils'
import { ElButton, ElDatePicker, ElOption, ElOptionGroup, ElSelect } from 'element-plus'
import { computed, type Ref, ref, unref } from 'vue'

import { FILTER_TYPE_LABEL } from './constants'
import { type FilterDateType, type IFilterDate } from './types'

/** Количество последних месяцев в списке быстрых фильтров */
const MONTHS_COUNT = 6

interface IMonthOption {
  /** Значение опции el-select */
  value: string
  /** Название месяца */
  label: string
  /** Первый день месяца в формате YYYY-MM-DD */
  start: string
  /** Последний день месяца в формате YYYY-MM-DD */
  end: string
}

const emit = defineEmits<{
  (e: 'createFilter', filter: IFilterDate, closeMenu: boolean): void
}>()

/** Последние MONTHS_COUNT месяцев (включая текущий) с учётом перехода через год */
const monthOptions: IMonthOption[] = (() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  return Array.from({ length: MONTHS_COUNT }, (_, index) => {
    const start = new Date(year, month - index, 1)
    const end = new Date(year, month - index + 1, 0)

    return {
      value: `month:${start.getFullYear()}-${start.getMonth() + 1}`,
      label: getCapitalizedMonth(start.getMonth() + 1),
      start: dateToBackendFormat(start),
      end: dateToBackendFormat(end)
    }
  })
})()

const type = ref<FilterDateType>('eq')
/** Значение el-select: тип фильтра или быстрый фильтр по месяцу */
const selectValue = ref<string>(unref(type))
const value = ref('')
const valueRange: Ref<string | [string, string]> = ref('')

const isValueRange = computed(() => {
  if (['eq', 'before', 'after'].includes(type.value)) return false
  return true
})

const changeType = (selected: string) => {
  value.value = ''
  valueRange.value = ''

  const month = monthOptions.find((m) => m.value === selected)

  // Быстрый фильтр по месяцу применяется сразу, тип фильтра при этом не меняется
  if (month) {
    selectValue.value = unref(type)
    emit('createFilter', { type: 'between', value: [month.start, month.end] }, true)
    return
  }

  type.value = selected as FilterDateType
}

const createFilter = (closeMenu: boolean) => {
  const _value = isValueRange.value ? unref(valueRange) : unref(value)
  const _type = isValueRange.value ? 'between' : unref(type)

  if (_value) {
    emit('createFilter', { type: _type, value: _value }, closeMenu)
    value.value = ''
    valueRange.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col w210px">
    <el-select
      v-model="selectValue"
      class="mb5px"
      :teleported="false"
      @change="changeType"
    >
      <el-option-group>
        <el-option
          value="eq"
          :label="FILTER_TYPE_LABEL.eq"
        />
      </el-option-group>
      <el-option-group>
        <el-option
          value="before"
          :label="FILTER_TYPE_LABEL.before"
        />
        <el-option
          value="after"
          :label="FILTER_TYPE_LABEL.after"
        />
        <el-option
          value="between"
          :label="FILTER_TYPE_LABEL.between"
        />
      </el-option-group>
      <el-option-group>
        <el-option
          v-for="month in monthOptions"
          :key="month.value"
          :value="month.value"
          :label="month.label"
        />
      </el-option-group>
    </el-select>

    <el-date-picker
      v-if="isValueRange"
      v-model="valueRange"
      style="width: 100%"
      format="DD-MM-YYYY"
      value-format="YYYY-MM-DD"
      class="mb5px"
      type="daterange"
      :teleported="false"
    />
    <el-date-picker
      v-else
      v-model="value"
      style="width: 100%"
      format="DD-MM-YYYY"
      value-format="YYYY-MM-DD"
      class="mb5px"
      type="date"
      :teleported="false"
    />

    <el-button @click="createFilter(true)">Применить</el-button>
  </div>
</template>
