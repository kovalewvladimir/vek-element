<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import {
  dateBackendToFrontendFormat,
  dateIsoToFrontendFormat,
  datetimeIsoToFrontendFormat,
  dateToBackendFormat,
  getCapitalizedMonth,
  timeIsoToFrontendFormat
} from '@vek-element/ui/utils'
import {
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElTable,
  ElTableColumn,
  ElTag
} from 'element-plus'
import { computed, ref } from 'vue'

// =========================
// Data
// =========================

const month = ref<number>(new Date().getMonth() + 1)
const date = ref<Date>(new Date())
const backendDate = ref<string>('2026-08-26')
const isoDate = ref<string>('2026-08-26T14:35:07.123456')

// =========================
// Computed
// =========================

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({ month: i + 1, name: getCapitalizedMonth(i + 1) }))
)

const rows = computed(() => [
  {
    fn: 'getCapitalizedMonth(number)',
    hint: 'номер месяца -> название с большой буквы',
    input: String(month.value),
    result: getCapitalizedMonth(month.value)
  },
  {
    fn: 'dateToBackendFormat(Date)',
    hint: 'Date -> YYYY-MM-DD',
    input: date.value ? date.value.toString() : '—',
    result: date.value ? dateToBackendFormat(date.value) : '—'
  },
  {
    fn: 'dateBackendToFrontendFormat(string)',
    hint: 'YYYY-MM-DD -> DD-MM-YYYY',
    input: backendDate.value,
    result: dateBackendToFrontendFormat(backendDate.value)
  },
  {
    fn: 'dateIsoToFrontendFormat(string)',
    hint: 'ISO -> DD-MM-YYYY',
    input: isoDate.value,
    result: dateIsoToFrontendFormat(isoDate.value)
  },
  {
    fn: 'timeIsoToFrontendFormat(string)',
    hint: 'ISO -> HH:MM:SS',
    input: isoDate.value,
    result: timeIsoToFrontendFormat(isoDate.value)
  },
  {
    fn: 'datetimeIsoToFrontendFormat(string)',
    hint: 'ISO -> DD-MM-YYYY HH:MM:SS',
    input: isoDate.value,
    result: datetimeIsoToFrontendFormat(isoDate.value)
  }
])
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>utils / date</h2>
    </template>

    <p>
      Конвертация дат между форматом backend (<code>YYYY-MM-DD</code>), ISO и форматом frontend
      (<code>DD-MM-YYYY</code>). Строку неподходящего вида функции возвращают без изменений — это
      удобно для <code>formatter</code> колонок <code>vu-virt-table</code>.
    </p>

    <el-divider content-position="left">Исходные значения</el-divider>
    <div class="flex flex-wrap items-center gap-20px">
      <span>
        Месяц
        <el-input-number
          v-model="month"
          :min="1"
          :max="12"
        />
      </span>
      <span>
        Date
        <el-date-picker
          v-model="date"
          type="date"
          format="DD.MM.YYYY"
        />
      </span>
      <span>
        Backend
        <el-input
          v-model="backendDate"
          class="!w-160px"
        />
      </span>
      <span>
        ISO
        <el-input
          v-model="isoDate"
          class="!w-260px"
        />
      </span>
    </div>

    <el-divider content-position="left">Результат</el-divider>
    <el-table :data="rows">
      <el-table-column
        prop="fn"
        label="Функция"
        width="320"
      />
      <el-table-column
        prop="hint"
        label="Преобразование"
        width="280"
      />
      <el-table-column
        prop="input"
        label="Вход"
        show-overflow-tooltip
      />
      <el-table-column
        label="Выход"
        width="220"
      >
        <template #default="{ row }">
          <el-tag>{{ row.result }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-divider content-position="left">getCapitalizedMonth — все месяцы</el-divider>
    <div class="flex flex-wrap gap-10px">
      <el-tag
        v-for="item in months"
        :key="item.month"
        type="info"
        >{{ item.month }} — {{ item.name }}</el-tag
      >
    </div>
  </vu-content-wrap>
</template>
