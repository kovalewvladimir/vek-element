<script setup lang="ts">
import { Columns, useEventBus, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

import { RouterLinkToTableSimpleCreate, RouterLinkToTableSimpleUpdate } from '@/navigation/links'

import { generateItem } from './data'
import { TABLE_SIMPLE_BUS_KEY } from './symbol'

// ==================
// Constants
// ==================

const COUNT_GENERATE_ITEMS = 100
const MAX_LOAD_PAGES = 5

// ==================
// Variables
// ==================
const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number', width: 50 },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'name1', label: 'Name1', type: 'string' },
    { prop: 'name2', label: 'Name2', type: 'string' },
    { prop: 'name3', label: 'Name3', type: 'string' },
    { prop: 'name4', label: 'Name4', type: 'string' },
    { prop: 'name5', label: 'Name5', type: 'string' },
    { prop: 'name6', label: 'Name6', type: 'string' },
    { prop: 'name7', label: 'Name7', type: 'string' },
    { prop: 'dateCreate', label: 'dateCreate', type: 'string', formatter: dateIsoToFrontendFormat },
    { prop: 'date.create', label: 'date.create', type: 'date', formatter: dateIsoToFrontendFormat }
  )
)

// ==================
// Methods
// ==================

let loadPages = 0
const loadData = async () => {
  console.log('loadData')

  await asyncSleep(1000)

  const loadLength = loadPages < MAX_LOAD_PAGES ? COUNT_GENERATE_ITEMS : COUNT_GENERATE_ITEMS / 10
  loadPages++
  return Array.from({ length: loadLength }).map(() => generateItem())
}

const busUserStatus = useEventBus(TABLE_SIMPLE_BUS_KEY)
busUserStatus.on(({ status, data }) => {
  if (!tableRef.value) return

  console.log('busUserStatus.on', status, data)

  switch (status) {
    case 'create': {
      tableRef.value.pushDataItem(data, { index: 0 })
      break
    }
    case 'update': {
      const index = tableRef.value.findDataItemIndex(data.id)
      if (index !== undefined) tableRef.value.updateDataItem(data, { index })
      break
    }
    case 'delete': {
      const index = tableRef.value.findDataItemIndex(data.id)
      if (index !== undefined) tableRef.value.deleteDataItem(index)
      break
    }
  }
})
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <el-button
        type="primary"
        class="mr-10px"
        @click="tableRef?.reloadData()"
        >Обновить</el-button
      >

      <router-link-to-table-simple-create />
    </template>

    <vu-virt-table
      ref="table"
      height="100%"
      row-unique-key="id"
      :columns="columns"
      :on-load-data="loadData"
    >
      <template #id="{ row }"
        ><span><router-link-to-table-simple-update :id="row.id" /></span
      ></template>
    </vu-virt-table>
  </vu-content-wrap>
</template>
