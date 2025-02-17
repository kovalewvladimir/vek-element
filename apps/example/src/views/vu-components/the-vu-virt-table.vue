<script setup lang="ts">
import { Columns, type OnLoadDataType, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ref, useTemplateRef } from 'vue'

const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number' },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'dateCreate', label: 'dateCreate', type: 'string', formatter: dateIsoToFrontendFormat },
    { prop: 'date.create', label: 'date.create', type: 'date', formatter: dateIsoToFrontendFormat }
  )
)

const getRandomDate = () => {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date()
  return new Date(start + Math.random() * (end.getTime() - start)).toISOString()
}

const loadData: OnLoadDataType = async () => {
  await asyncSleep(1000)

  return Array.from({ length: 100 }).map((_, index) => ({
    id: index,
    name: `Name ${index}`,
    dateCreate: getRandomDate(),
    date: {
      create: getRandomDate()
    }
  }))
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-virt-table</h2>
      <button @click="tableRef?.reloadData()">Reload</button>
    </template>

    <vu-virt-table
      ref="table"
      :columns="columns"
      :on-load-data="loadData"
    >
      <!-- <template #date_create="{ row }">{{ row }}</template> -->
    </vu-virt-table>
  </vu-content-wrap>
</template>
