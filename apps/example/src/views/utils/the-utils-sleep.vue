<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { asyncSleep, syncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElInputNumber, ElTag } from 'element-plus'
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

// =========================
// Data
// =========================

const ms = ref<number>(1000)

const asyncElapsed = ref<number>(0)
const syncElapsed = ref<number>(0)
const running = ref(false)

/** Счётчик крутится на requestAnimationFrame — по нему видно, заблокирован ли UI */
const ticks = ref(0)
let rafId = 0

const tick = () => {
  ticks.value++
  rafId = requestAnimationFrame(tick)
}

const startTicks = () => {
  rafId = requestAnimationFrame(tick)
}
const stopTicks = () => cancelAnimationFrame(rafId)

// Страница кэшируется, поэтому важны обе пары хуков
onMounted(startTicks)
onActivated(startTicks)
onDeactivated(stopTicks)
onUnmounted(stopTicks)

// =========================
// Methods
// =========================

/** Не блокирует поток: анимации и счётчик продолжают работать */
const runAsync = async () => {
  running.value = true
  const start = performance.now()
  await asyncSleep(ms.value)
  asyncElapsed.value = Math.round(performance.now() - start)
  running.value = false
}

/** Блокирует поток целиком: счётчик замирает, кнопка не успевает перерисоваться */
const runSync = () => {
  const start = performance.now()
  syncSleep(ms.value)
  syncElapsed.value = Math.round(performance.now() - start)
}

/** Типовое применение: имитация задержки сети */
const fakeRequest = async () => {
  running.value = true
  await asyncSleep(ms.value)
  running.value = false
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>utils / sleep</h2>
    </template>

    <p>
      <code>asyncSleep</code> — промис на <code>setTimeout</code>, применяется для имитации задержки
      сети в демо и тестах. <code>syncSleep</code> — цикл ожидания, блокирующий поток; нужен только
      чтобы искусственно создать долгую синхронную работу.
    </p>

    <el-divider content-position="left">Задержка</el-divider>
    <div class="flex items-center gap-20px">
      <el-input-number
        v-model="ms"
        :min="0"
        :step="250"
      />
      <el-tag type="info">Кадров отрисовано: {{ ticks }}</el-tag>
    </div>

    <el-divider content-position="left">asyncSleep</el-divider>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        :loading="running"
        @click="runAsync"
        >await asyncSleep({{ ms }})</el-button
      >
      <el-button
        :loading="running"
        @click="fakeRequest"
        >Имитация запроса</el-button
      >
      <el-tag>Прошло: {{ asyncElapsed }} мс</el-tag>
    </div>
    <p>Счётчик кадров продолжает расти — поток свободен.</p>

    <el-divider content-position="left">syncSleep</el-divider>
    <el-alert
      type="warning"
      class="mb-10px"
      :closable="false"
      show-icon
      title="Блокирует UI: вкладка перестанет отвечать на всё время задержки"
    />
    <div class="flex items-center gap-10px">
      <el-button
        type="danger"
        @click="runSync"
        >syncSleep({{ ms }})</el-button
      >
      <el-tag>Прошло: {{ syncElapsed }} мс</el-tag>
    </div>
    <p>Счётчик кадров замирает на время выполнения.</p>
  </vu-content-wrap>
</template>
