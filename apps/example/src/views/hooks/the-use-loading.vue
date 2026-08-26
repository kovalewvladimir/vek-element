<script setup lang="ts">
import { useLoading, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElButton, ElDivider, ElInputNumber, ElTable, ElTableColumn, ElTag } from 'element-plus'
import { ref } from 'vue'

// =========================
// Data
// =========================

const delay = ref<number>(200)
const duration = ref<number>(1000)

/** delay — сколько ждать, прежде чем показать индикатор */
const { loading, loadingWrapper } = useLoading(delay.value)

/** enableTimingLog = true — время выполнения печатается в console.time */
const { loading: loadingTiming, loadingWrapper: loadingWrapperTiming } = useLoading(0, true)

const rows = ref<{ id: number; name: string }[]>([])

// =========================
// Methods
// =========================

/** Быстрее delay — индикатор не успевает появиться, мигания нет */
const runFast = loadingWrapper(async () => {
  await asyncSleep(100)
})

/** Дольше delay — индикатор появляется */
const runSlow = loadingWrapper(async () => {
  await asyncSleep(duration.value)
})

/** Исключение перехватывается и показывается через VuNotificationShow */
const runError = loadingWrapper(async () => {
  await asyncSleep(300)
  throw new Error('Что-то пошло не так')
})

const loadRows = loadingWrapperTiming(async () => {
  rows.value = []
  await asyncSleep(800)
  rows.value = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Строка ${i + 1}` }))
})
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-loading</h2>
    </template>

    <p>
      <code>loadingWrapper</code> оборачивает async-функцию: включает <code>loading</code> через
      <code>delay</code> мс, гарантированно выключает его в <code>finally</code> и показывает
      уведомление, если функция бросила исключение.
    </p>

    <el-divider content-position="left">Параметры</el-divider>
    <div class="flex items-center gap-20px">
      <span>
        delay (мс, задан при создании хука)
        <el-input-number
          v-model="delay"
          disabled
          :min="0"
          :step="50"
        />
      </span>
      <span>
        длительность операции (мс)
        <el-input-number
          v-model="duration"
          :min="0"
          :step="250"
        />
      </span>
      <el-tag :type="loading ? 'warning' : 'info'">loading: {{ loading }}</el-tag>
    </div>

    <el-divider content-position="left">Сценарии</el-divider>
    <div class="flex items-center gap-10px">
      <el-button
        :loading="loading"
        @click="runFast()"
        >Быстро (100 мс)</el-button
      >
      <el-button
        type="primary"
        :loading="loading"
        @click="runSlow()"
        >Долго ({{ duration }} мс)</el-button
      >
      <el-button
        type="danger"
        :loading="loading"
        @click="runError()"
        >С ошибкой</el-button
      >
    </div>

    <el-divider content-position="left">v-loading + enableTimingLog</el-divider>
    <p>Время выполнения печатается в консоль (<code>console.time('loadingWrapper')</code>).</p>
    <el-button
      type="primary"
      class="mb-10px"
      @click="loadRows()"
      >Загрузить данные</el-button
    >
    <div class="w-400px">
      <el-table
        v-loading="loadingTiming"
        :data="rows"
        empty-text="Нет данных"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column
          prop="name"
          label="Name"
        />
      </el-table>
    </div>
  </vu-content-wrap>
</template>
