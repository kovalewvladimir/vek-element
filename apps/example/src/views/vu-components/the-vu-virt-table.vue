<script setup lang="ts">
import { Columns, type OnLoadDataType, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ref, useTemplateRef } from 'vue'

const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number' },
    { prop: 'name', label: 'Name', type: 'string' }
  )
)

const loadData: OnLoadDataType = async () => {
  await asyncSleep(1000)

  return Array.from({ length: 100 }).map((_, index) => ({
    id: index,
    name: `Name ${index}`
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
    />
  </vu-content-wrap>
</template>
