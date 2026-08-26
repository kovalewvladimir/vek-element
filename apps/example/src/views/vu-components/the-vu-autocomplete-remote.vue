<script setup lang="ts">
import { VuAutocompleteRemote, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElInputNumber, ElTag } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

// =========================
// Types
// =========================

interface IOption {
  value: string
  label: string
}

interface IEmployee {
  id: number
  name: string
  department: string
}

// =========================
// Data
// =========================

const basicValue = ref<string>('')
const basicRef = useTemplateRef('basicRef')
const basicResult = ref<string>('—')

const employeeValue = ref<string>('')
const employeeRef = useTemplateRef('employeeRef')
const employeeResult = ref<string>('—')

const cityValue = ref<string>('')
const maxReturnComplete = ref<number>(10)
const waitSearch = ref<number>(500)

// =========================
// Methods
// =========================

/** Загрузка выполняется один раз при монтировании; пока идёт — виден скелет */
const getBasicOptions = async (): Promise<{ data: IOption[] }> => {
  await asyncSleep(2000)
  return {
    data: [
      { value: 'Test1', label: 'Первый' },
      { value: 'Test2', label: 'Второй' },
      { value: 'Test3', label: 'Третий' }
    ]
  }
}

/** Своя форма данных: поиск и подстановка идут по value-key */
const getEmployees = async (): Promise<{ data: IEmployee[] }> => {
  await asyncSleep(1000)
  return {
    data: [
      { id: 1, name: 'Иванов Иван', department: 'Разработка' },
      { id: 2, name: 'Петров Пётр', department: 'Аналитика' },
      { id: 3, name: 'Сидорова Анна', department: 'Тестирование' },
      { id: 4, name: 'Кузнецов Олег', department: 'Разработка' }
    ]
  }
}

/** Большой список: на нём видно, зачем нужны max-return-complete и wait-search */
const getCities = async (): Promise<{ data: IOption[] }> => {
  await asyncSleep(500)
  return {
    data: Array.from({ length: 1000 }, (_, i) => ({
      value: `Город ${i + 1}`,
      label: `Город ${i + 1}`
    }))
  }
}

/** isValid — введённое значение есть среди загруженных опций */
const checkBasic = () => {
  const option = basicRef.value?.getOption()
  basicResult.value = `isValid: ${basicRef.value?.isValid()}, getOption: ${
    option ? JSON.stringify(option) : 'undefined'
  }`
}

const checkEmployee = () => {
  const option = employeeRef.value?.getOption()
  employeeResult.value = option ? `${option.name} — ${option.department}` : 'Сотрудник не выбран'
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-autocomplete-remote</h2>
    </template>

    <p>
      Autocomplete, который один раз подгружает весь список опций при монтировании и дальше ищет по
      нему на клиенте. Пока данные грузятся, на месте поля показывается скелет
      (<code>el-skeleton</code>), поэтому вёрстка не прыгает.
    </p>

    <el-divider content-position="left">Базовый пример (загрузка 2 с)</el-divider>
    <p>
      Поиск идёт по полю <code>value</code> (значение <code>value-key</code> по умолчанию), при
      пустом запросе показываются первые опции.
    </p>

    <div class="max-w-400px">
      <vu-autocomplete-remote
        ref="basicRef"
        v-model="basicValue"
        placeholder="Начните вводить: Test"
        :get-loading-options="getBasicOptions"
      />
    </div>

    <div class="mt-10px flex items-center gap-10px">
      <el-button
        type="primary"
        @click="checkBasic"
        >isValid / getOption</el-button
      >
      <el-tag>v-model: {{ basicValue === '' ? '(пусто)' : basicValue }}</el-tag>
      <el-tag type="info">{{ basicResult }}</el-tag>
    </div>

    <el-divider content-position="left">Аттрибуты value-key и placeholder</el-divider>
    <p>
      Опции — произвольные объекты. <code>value-key</code> указывает поле, по которому идут поиск,
      подстановка в <code>v-model</code> и отображение в списке.
    </p>

    <div class="max-w-400px">
      <vu-autocomplete-remote
        ref="employeeRef"
        v-model="employeeValue"
        value-key="name"
        placeholder="Фамилия сотрудника"
        :get-loading-options="getEmployees"
      />
    </div>

    <div class="mt-10px flex items-center gap-10px">
      <el-button
        type="primary"
        @click="checkEmployee"
        >getOption</el-button
      >
      <el-tag type="info">{{ employeeResult }}</el-tag>
    </div>

    <el-divider content-position="left">Аттрибуты max-return-complete и wait-search</el-divider>
    <el-alert
      type="info"
      class="mb-10px"
      :closable="false"
      show-icon
      title="Список из 1000 элементов: max-return-complete ограничивает выпадающий список, wait-search задаёт debounce ввода"
    />

    <div class="mb-10px flex items-center gap-20px">
      <span>
        max-return-complete
        <el-input-number
          v-model="maxReturnComplete"
          :min="1"
          :max="100"
        />
      </span>
      <span>
        wait-search, мс
        <el-input-number
          v-model="waitSearch"
          :min="0"
          :step="250"
        />
      </span>
    </div>

    <div class="max-w-400px">
      <vu-autocomplete-remote
        v-model="cityValue"
        placeholder="Введите: Город 1"
        :max-return-complete="maxReturnComplete"
        :wait-search="waitSearch"
        :get-loading-options="getCities"
      />
    </div>
  </vu-content-wrap>
</template>
