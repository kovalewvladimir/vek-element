<script setup lang="ts">
import { Columns, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

// ==================
// Constants
// ==================

const COUNT_GENERATE_ITEMS = 100

// ==================
// Variables
// ==================
const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number' },
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

const getRandomDate = () => {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date()
  return new Date(start + Math.random() * (end.getTime() - start)).toISOString()
}

let id = 0
const generateItem = (name: string = '') => ({
  id: id++,
  isExpandable: Math.random() > 0.5,
  name: `${name ? name + ' - ' : ''}Name ${Math.floor(Math.random() * 1000)}`,
  name1: `Name ${Math.floor(Math.random() * 1000)}`,
  name2: `Name ${Math.floor(Math.random() * 1000)}`,
  name3: `Name ${Math.floor(Math.random() * 1000)}`,
  name4: `Name ${Math.floor(Math.random() * 1000)}`,
  name5: `Name ${Math.floor(Math.random() * 1000)}`,
  name6: `Name ${Math.floor(Math.random() * 1000)}`,
  name7: `Name ${Math.floor(Math.random() * 1000)}`,
  dateCreate: getRandomDate(),
  date: {
    create: getRandomDate()
  }
})

const loadData = async () => {
  console.log('loadData')

  await asyncSleep(1000)
  return Array.from({ length: COUNT_GENERATE_ITEMS }).map(() => generateItem())
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <el-button
        type="primary"
        @click="tableRef?.reloadData()"
        >Reload</el-button
      >
    </template>

    <vu-virt-table
      ref="table"
      height="100%"
      row-unique-key="id"
      :columns="columns"
      :on-load-data="loadData"
    >
    </vu-virt-table>
  </vu-content-wrap>
</template>
