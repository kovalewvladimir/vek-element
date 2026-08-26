<script setup lang="ts">
import { Columns, useVirtTableData, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElAlert, ElButton, ElDivider, ElSwitch, ElTag } from 'element-plus'
import { type Ref, ref } from 'vue'

// =========================
// Types
// =========================

interface IRow {
  id: number
  name: string
  amount: number
}

// =========================
// Constants
// =========================

/** Общий идентификатор хранилища: таблица создаёт его, страница — читает */
const TABLE_DATA_SYMBOL = Symbol('the-use-virt-table-data')

const PAGE_SIZE = 50

// =========================
// Data
// =========================

const showTable = ref(true)

/** Тот же symbol, что передан таблице через data-symbol */
const { getStore } = useVirtTableData<IRow>(TABLE_DATA_SYMBOL)

const storeInfo = ref<string>('—')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number', width: 80 },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'amount', label: 'Сумма', type: 'number', width: 120, align: 'right' }
  )
)

// Отдельное хранилище без таблицы — показывает жизненный цикл create/get/destroy
const standalone = useVirtTableData<IRow>()
let standaloneStore: Ref<IRow[]> | null = null
const isStandaloneCreated = ref(false)
const standaloneLog = ref<string[]>([])

// =========================
// Methods
// =========================

const loadData = async ({ page }: { page: number }) => {
  await asyncSleep(300)
  const from = (page - 1) * PAGE_SIZE
  if (from >= 200) return []

  return Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: from + i + 1,
    name: `Строка ${from + i + 1}`,
    amount: Math.round(Math.random() * 10_000) / 100
  }))
}

/** Данные таблицы доступны снаружи по symbol */
const readStore = () => {
  const store = getStore()
  if (!store) {
    storeInfo.value = 'getStore() === null (таблица размонтирована — хранилище удалено)'
    return
  }
  const rows = store.value
  const sum = rows.reduce((acc, row) => acc + row.amount, 0)
  storeInfo.value = `Строк: ${rows.length}, сумма: ${sum.toFixed(2)}`
}

/** Мутация снаружи отражается в таблице: это один и тот же ref */
const mutateStore = () => {
  const store = getStore()
  if (!store) return
  for (const row of store.value) row.name = `${row.name} *`
  readStore()
}

const log = (text: string) => standaloneLog.value.unshift(text)

const createStandalone = () => {
  standaloneStore = standalone.createStore()
  standaloneStore.value = [{ id: 1, name: 'Из createStore', amount: 1 }]
  isStandaloneCreated.value = true
  log('createStore() — хранилище создано')
}

const getStandalone = () => {
  const store = standalone.getStore()
  log(store ? `getStore() — строк: ${store.value.length}` : 'getStore() — null')
}

const destroyStandalone = () => {
  standalone.destroyStore()
  standaloneStore = null
  isStandaloneCreated.value = false
  log('destroyStore() — хранилище удалено')
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-virt-table-data</h2>
    </template>

    <p>
      Реестр хранилищ данных по <code>symbol</code>. <code>vu-virt-table</code> с пропом
      <code>data-symbol</code> кладёт свои строки в такое хранилище, а любой другой код получает к
      ним доступ по тому же symbol — без ref на компонент.
    </p>

    <el-divider content-position="left">Доступ к данным таблицы снаружи</el-divider>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="readStore"
        >getStore()</el-button
      >
      <el-button @click="mutateStore">Изменить name во всех строках</el-button>
      <span>
        Таблица смонтирована
        <el-switch v-model="showTable" />
      </span>
      <el-tag type="info">{{ storeInfo }}</el-tag>
    </div>

    <el-alert
      type="info"
      class="my-10px"
      :closable="false"
      show-icon
      title="При размонтировании таблица вызывает destroyStore(), поэтому getStore() вернёт null"
    />

    <div class="h-300px">
      <vu-virt-table
        v-if="showTable"
        height="100%"
        row-unique-key="id"
        :columns="columns"
        :data-symbol="TABLE_DATA_SYMBOL"
        :on-load-data="loadData"
      />
    </div>

    <el-divider content-position="left">Хранилище без таблицы</el-divider>
    <p>Хук можно использовать самостоятельно: symbol сгенерируется автоматически.</p>
    <div class="flex items-center gap-10px">
      <el-button @click="createStandalone">createStore</el-button>
      <el-button @click="getStandalone">getStore</el-button>
      <el-button
        type="danger"
        @click="destroyStandalone"
        >destroyStore</el-button
      >
      <el-tag :type="isStandaloneCreated ? 'success' : 'info'">
        {{ isStandaloneCreated ? 'создано' : 'нет хранилища' }}
      </el-tag>
    </div>
    <div
      v-for="(item, index) in standaloneLog"
      :key="index"
      class="mt-5px"
    >
      {{ item }}
    </div>
  </vu-content-wrap>
</template>
