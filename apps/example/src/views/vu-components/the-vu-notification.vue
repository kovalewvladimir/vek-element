<script setup lang="ts">
import {
  useLoading,
  VuContentWrap,
  VuNotificationConfig,
  VuNotificationShow
} from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElInput, ElTag } from 'element-plus'
import { onDeactivated, onUnmounted, ref } from 'vue'

// =========================
// Types
// =========================

/** Ошибка, которую можно скрыть через VuNotificationConfig */
class DemoSkippedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DemoSkippedError'
  }
}

// =========================
// Data
// =========================

const title = ref<string>('Заголовок')
const message = ref<string>('Текст уведомления')

const isSkipped = ref(false)

const { loading, loadingWrapper } = useLoading()

// =========================
// Methods
// =========================

const showSuccess = () => VuNotificationShow(title.value, message.value)
const showError = () => VuNotificationShow(title.value, message.value, 'error')

/** success закрывает предыдущие сообщения, error — накапливаются */
const showMany = () => {
  for (let i = 1; i <= 3; i++) VuNotificationShow(`Успех ${i}`, `Сообщение ${i}`)
}

/** Ошибка внутри loadingWrapper показывается уведомлением автоматически */
const throwInWrapper = loadingWrapper(async () => {
  await asyncSleep(300)
  throw new Error('Ошибка внутри loadingWrapper')
})

const throwSkippedInWrapper = loadingWrapper(async () => {
  await asyncSleep(300)
  throw new DemoSkippedError('Эта ошибка скрыта через VuNotificationConfig')
})

/** Глобальная настройка: какие классы ошибок не показывать */
const toggleSkipped = () => {
  isSkipped.value = !isSkipped.value
  VuNotificationConfig(isSkipped.value ? [DemoSkippedError] : [])
}

// Настройка глобальная — возвращаем значение по умолчанию при уходе со страницы
const resetConfig = () => {
  isSkipped.value = false
  VuNotificationConfig([])
}
onDeactivated(resetConfig)
onUnmounted(resetConfig)
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-notification-show</h2>
    </template>

    <p>
      Обёртка над <code>ElMessage</code>: жирный заголовок + текст, группировка одинаковых сообщений
      и разное время показа — <code>success</code> 5с, <code>error</code> 30с (плюс
      <code>console.warn</code>).
    </p>

    <el-divider content-position="left">Свой текст</el-divider>
    <div class="flex items-center gap-10px">
      <el-input
        v-model="title"
        class="!w-200px"
        placeholder="Заголовок"
      />
      <el-input
        v-model="message"
        class="!w-300px"
        placeholder="Сообщение"
      />
      <el-button
        type="success"
        @click="showSuccess"
        >success</el-button
      >
      <el-button
        type="danger"
        @click="showError"
        >error</el-button
      >
    </div>

    <el-divider content-position="left">Несколько подряд</el-divider>
    <p>
      <code>success</code> вызывает <code>ElMessage.closeAll()</code> — на экране останется только
      последнее сообщение.
    </p>
    <el-button @click="showMany">3 x success</el-button>

    <el-divider content-position="left">Уведомления из useLoading</el-divider>
    <p>Исключение внутри <code>loadingWrapper</code> перехватывается и показывается как error.</p>
    <div class="flex items-center gap-10px">
      <el-button
        type="danger"
        :loading="loading"
        @click="throwInWrapper()"
        >Обычная ошибка</el-button
      >
      <el-button
        :loading="loading"
        @click="throwSkippedInWrapper()"
        >DemoSkippedError</el-button
      >
    </div>

    <el-divider content-position="left">VuNotificationConfig</el-divider>
    <el-alert
      type="warning"
      :closable="false"
      show-icon
      title="Настройка глобальная: сбрасывается при уходе со страницы"
      class="mb-10px"
    />
    <div class="flex items-center gap-10px">
      <el-button @click="toggleSkipped">
        {{ isSkipped ? 'Показывать DemoSkippedError' : 'Скрыть DemoSkippedError' }}
      </el-button>
      <el-tag :type="isSkipped ? 'warning' : 'info'">
        skippedErrors: {{ isSkipped ? '[DemoSkippedError]' : '[]' }}
      </el-tag>
    </div>
  </vu-content-wrap>
</template>
