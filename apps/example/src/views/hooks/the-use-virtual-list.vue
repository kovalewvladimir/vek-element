<script setup lang="ts">
import { useVirtualList, VuContentWrap } from '@vek-element/ui'
import { ElButton, ElDivider, ElInputNumber, ElSwitch, ElTag } from 'element-plus'
import { computed, ref } from 'vue'

// =========================
// Types
// =========================

interface Item {
  id: number
  name: string
}

// =========================
// Data
// =========================

const ROW_HEIGHT = 32

const items = ref<Item[]>(
  Array.from({ length: 10_000 }, (_, i) => ({ id: i + 1, name: `Элемент ${i + 1}` }))
)

const scrollIndex = ref<number>(5000)

// Фиксированная высота строки
const {
  list: fixedList,
  scrollTo,
  invalidate,
  containerProps: fixedContainerProps,
  wrapperProps: fixedWrapperProps
} = useVirtualList(items, { itemHeight: ROW_HEIGHT, overscan: 5 })

// Переменная высота строки: каждая пятая строка выше
const variableItems = ref<Item[]>(
  Array.from({ length: 2000 }, (_, i) => ({ id: i + 1, name: `Элемент ${i + 1}` }))
)
const getItemHeight = (index: number) => (index % 5 === 0 ? 64 : 32)

const {
  list: variableList,
  containerProps: variableContainerProps,
  wrapperProps: variableWrapperProps
} = useVirtualList(variableItems, { itemHeight: getItemHeight, overscan: 5 })

const renderedCount = computed(() => fixedList.value.length)
const showIndex = ref(true)

// =========================
// Methods
// =========================

/** Мутация массива в пределах видимого диапазона требует invalidate */
const addItem = () => {
  items.value.unshift({ id: items.value.length + 1, name: `Новый ${items.value.length + 1}` })
  invalidate()
}

const clear = () => {
  items.value = []
  invalidate()
}

const refill = () => {
  items.value = Array.from({ length: 10_000 }, (_, i) => ({ id: i + 1, name: `Элемент ${i + 1}` }))
  invalidate()
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-virtual-list</h2>
    </template>

    <p>
      Рендерит только видимые строки плюс <code>overscan</code>. Возвращает
      <code>containerProps</code> (ref + onScroll + overflow) и
      <code>wrapperProps</code> (высота-распорка и отступ сверху) — их достаточно повесить через
      <code>v-bind</code>.
    </p>

    <el-divider content-position="left"
      >Фиксированная высота строки ({{ ROW_HEIGHT }}px)</el-divider
    >
    <div class="mb-10px flex items-center gap-10px">
      <el-input-number
        v-model="scrollIndex"
        :min="0"
        :max="items.length"
      />
      <el-button
        type="primary"
        @click="scrollTo(scrollIndex)"
        >scrollTo</el-button
      >
      <el-button @click="addItem">unshift + invalidate</el-button>
      <el-button @click="clear">Очистить</el-button>
      <el-button @click="refill">Заполнить</el-button>
      <span>
        index
        <el-switch v-model="showIndex" />
      </span>
      <el-tag type="info">Всего: {{ items.length }}</el-tag>
      <el-tag>В DOM: {{ renderedCount }}</el-tag>
    </div>

    <div
      v-bind="fixedContainerProps"
      class="h-300px b-1 b-solid b-[var(--el-border-color-light)] rounded-[var(--el-border-radius-base)]"
    >
      <div v-bind="fixedWrapperProps">
        <div
          v-for="item in fixedList"
          :key="item.index"
          class="flex items-center gap-10px b-b-1 b-b-solid b-b-[var(--el-border-color-lighter)] px-10px"
          :style="{ height: `${ROW_HEIGHT}px` }"
        >
          <el-tag
            v-if="showIndex"
            size="small"
            type="info"
            >{{ item.index }}</el-tag
          >
          <span>{{ item.data.name }}</span>
        </div>
      </div>
    </div>

    <el-divider content-position="left">Переменная высота строки</el-divider>
    <p><code>itemHeight</code> как функция: каждая пятая строка — 64px, остальные — 32px.</p>

    <div
      v-bind="variableContainerProps"
      class="h-300px b-1 b-solid b-[var(--el-border-color-light)] rounded-[var(--el-border-radius-base)]"
    >
      <div v-bind="variableWrapperProps">
        <div
          v-for="item in variableList"
          :key="item.index"
          class="flex items-center gap-10px b-b-1 b-b-solid b-b-[var(--el-border-color-lighter)] px-10px"
          :style="{ height: `${getItemHeight(item.index)}px` }"
        >
          <el-tag
            size="small"
            :type="item.index % 5 === 0 ? 'warning' : 'info'"
            >{{ item.index }}</el-tag
          >
          <span>{{ item.data.name }}</span>
        </div>
      </div>
    </div>
  </vu-content-wrap>
</template>
