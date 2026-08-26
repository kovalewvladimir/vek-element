<script setup lang="ts">
import { useScrollPosition, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElTag } from 'element-plus'
import { nextTick, ref, useTemplateRef } from 'vue'

// =========================
// Data
// =========================

const containerRef = useTemplateRef<HTMLElement>('containerRef')

const generate = (prefix: string) => Array.from({ length: 200 }, (_, i) => `${prefix} ${i + 1}`)

const items = ref<string[]>(generate('Строка'))
const loading = ref(false)
const generation = ref(1)

const { saveScrollPosition, restoreScrollPosition } = useScrollPosition(containerRef)

const savedPosition = ref<string>('—')

// =========================
// Methods
// =========================

const save = () => {
  saveScrollPosition()
  const el = containerRef.value
  savedPosition.value = el ? `x: ${el.scrollLeft}, y: ${Math.round(el.scrollTop)}` : '—'
}

const restore = () => restoreScrollPosition()

/**
 * Типовой сценарий: перезагрузка данных без потери позиции прокрутки.
 * Позиция сохраняется до подмены данных и восстанавливается после рендера.
 */
const reloadKeepPosition = async () => {
  saveScrollPosition()
  loading.value = true

  items.value = []
  await asyncSleep(500)
  generation.value++
  items.value = generate(`Строка (загрузка ${generation.value})`)

  loading.value = false
  await nextTick()
  restoreScrollPosition()
}

/** Тот же сценарий, но без восстановления — прокрутка улетает наверх */
const reloadLosePosition = async () => {
  loading.value = true

  items.value = []
  await asyncSleep(500)
  generation.value++
  items.value = generate(`Строка (загрузка ${generation.value})`)

  loading.value = false
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-scroll-position</h2>
    </template>

    <p>
      Запоминает <code>scrollLeft</code>/<code>scrollTop</code> контейнера и возвращает его на
      место. Используется в <code>vu-virt-table</code>, чтобы перезагрузка данных не сбрасывала
      прокрутку.
    </p>

    <el-alert
      type="info"
      class="mb-10px"
      :closable="false"
      show-icon
      title="Прокрутите список ниже, затем нажмите «Перезагрузить с сохранением» и «без сохранения»"
    />

    <el-divider content-position="left">Управление</el-divider>
    <div class="flex items-center gap-10px">
      <el-button @click="save">saveScrollPosition</el-button>
      <el-button @click="restore">restoreScrollPosition</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="reloadKeepPosition"
        >Перезагрузить с сохранением</el-button
      >
      <el-button
        type="danger"
        :loading="loading"
        @click="reloadLosePosition"
        >Перезагрузить без сохранения</el-button
      >
      <el-tag type="info">Сохранено — {{ savedPosition }}</el-tag>
    </div>

    <el-divider content-position="left">Контейнер</el-divider>
    <div
      ref="containerRef"
      class="h-300px overflow-auto b-1 b-solid b-[var(--el-border-color-light)] rounded-[var(--el-border-radius-base)]"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="w-1200px b-b-1 b-b-solid b-b-[var(--el-border-color-lighter)] px-10px py-8px"
      >
        {{ item }}
      </div>
    </div>
  </vu-content-wrap>
</template>
