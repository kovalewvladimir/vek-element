<script setup lang="ts">
import { useInfiniteScroll, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElInputNumber, ElSwitch, ElTag } from 'element-plus'
import { computed, ref, useTemplateRef } from 'vue'

// =========================
// Constants
// =========================

const PAGE_SIZE = 20
const TOTAL = 120

// =========================
// Data
// =========================

const containerRef = useTemplateRef<HTMLElement>('containerRef')

const items = ref<string[]>([])
const page = ref(0)
const loading = ref(false)
const isError = ref(false)

/** Имитация сбоя загрузки: после ошибки canLoadMore вернёт false */
const breakNextLoad = ref(false)
const distance = ref<number>(10)

const isAllLoaded = computed(() => items.value.length >= TOTAL)

// =========================
// Methods
// =========================

const loadMore = async () => {
  loading.value = true
  try {
    await asyncSleep(600)

    if (breakNextLoad.value) {
      breakNextLoad.value = false
      isError.value = true
      throw new Error('Ошибка загрузки страницы')
    }

    page.value++
    const from = items.value.length
    const count = Math.min(PAGE_SIZE, TOTAL - from)
    items.value.push(
      ...Array.from({ length: count }, (_, i) => `Строка ${from + i + 1} (стр. ${page.value})`)
    )
  } finally {
    loading.value = false
  }
}

// canLoadMore реактивна: сброс isError/isAllLoaded сам запустит проверку
useInfiniteScroll(containerRef, loadMore, {
  distance: distance.value,
  canLoadMore: () => !isAllLoaded.value && !isError.value
})

const retry = () => {
  isError.value = false
}

const reload = () => {
  items.value = []
  page.value = 0
  isError.value = false
  containerRef.value?.scrollTo(0, 0)
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-infinite-scroll</h2>
    </template>

    <p>
      Дозагружает данные при приближении к нижнему краю контейнера. После успешной загрузки
      проверяет снова — если содержимое поместилось без скроллбара, грузит следующую порцию.
    </p>

    <el-divider content-position="left">Управление</el-divider>
    <div class="flex items-center gap-10px">
      <span>
        distance (px, задан при создании)
        <el-input-number
          v-model="distance"
          disabled
        />
      </span>
      <span>
        Сломать следующую загрузку
        <el-switch v-model="breakNextLoad" />
      </span>
      <el-button @click="reload">Перезагрузить</el-button>
      <el-tag type="info">Загружено: {{ items.length }} / {{ TOTAL }}</el-tag>
      <el-tag v-if="loading">Загрузка…</el-tag>
      <el-tag
        v-if="isAllLoaded"
        type="success"
        >Всё загружено</el-tag
      >
    </div>

    <el-alert
      v-if="isError"
      type="error"
      class="my-10px"
      :closable="false"
      show-icon
      title="Загрузка остановлена: canLoadMore вернул false"
    >
      <el-button
        size="small"
        @click="retry"
        >Повторить</el-button
      >
    </el-alert>

    <el-divider content-position="left">Список</el-divider>
    <div
      ref="containerRef"
      class="h-300px overflow-y-auto b-1 b-solid b-[var(--el-border-color-light)] rounded-[var(--el-border-radius-base)]"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="b-b-1 b-b-solid b-b-[var(--el-border-color-lighter)] px-10px py-8px"
      >
        {{ item }}
      </div>

      <div
        v-if="loading"
        class="p-10px text-center c-[var(--el-text-color-secondary)]"
      >
        Загрузка…
      </div>
      <div
        v-else-if="isAllLoaded"
        class="p-10px text-center c-[var(--el-text-color-secondary)]"
      >
        Больше данных нет
      </div>
    </div>
  </vu-content-wrap>
</template>
